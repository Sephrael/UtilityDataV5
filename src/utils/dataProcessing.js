import * as XLSX from 'xlsx';
import { addMonths, format, parse, subMonths, isSameMonth } from 'date-fns';

export const parseData = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                const processedData = processRawData(jsonData);
                resolve(processedData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

const processRawData = (data) => {
    const accounts = {};

    data.forEach((row) => {
        const accountId = row['Account'];
        if (!accountId) return;

        if (!accounts[accountId]) {
            accounts[accountId] = {
                accountId,
                serviceAddress: row['Service Address'],
                mailingAddress: row['Mailing Address'],
                settlementMonth: row['Settlement Month'],
                records: [],
            };
        }

        // Handle Date
        let date = row['Billing Period'];
        // If it's not a date object (e.g. string or number), try to parse it
        if (!(date instanceof Date)) {
            // If it's a number (Excel serial), XLSX cellDates:true should have handled it, 
            // but if it failed or wasn't used correctly, we might need manual handling.
            // However, we used cellDates: true in read(), so it should be a Date.
            // If it's a string, try to parse it.
            if (typeof date === 'string') {
                date = new Date(date);
            }
        }

        accounts[accountId].records.push({
            date: date,
            netGenConsumption: row['Net_Gen_Consumption'] || 0,
            annualNetSurplus: row['Annual_Net_Surplus'] || 0,
            netSurplusCashValue: row['Net_Surplus_Cash_Value'] || 0,
        });
    });

    // Sort records by date for each account
    Object.values(accounts).forEach((account) => {
        account.records.sort((a, b) => a.date - b.date);
    });

    return accounts;
};

export const getReportData = (accountData, targetMonth, targetYear) => {
    // targetMonth is 0-indexed (0 = Jan, 11 = Dec) or 1-indexed? Let's use 0-indexed for JS Date compatibility
    // But UI might pass 1-indexed. Let's assume we pass a Date object or month/year numbers.
    // Let's say we pass month index (0-11) and full year (2023).

    const targetDate = new Date(targetYear, targetMonth, 1); // 1st of the month

    // We want the 12 months ENDING in targetDate.
    // So from (targetDate - 11 months) to targetDate.

    const reportData = [];
    let currentDate = subMonths(targetDate, 11);

    for (let i = 0; i < 12; i++) {
        // Find record for this month/year
        const record = accountData.records.find(r => isSameMonth(r.date, currentDate));

        if (record) {
            reportData.push({
                ...record,
                monthLabel: format(currentDate, 'MMM-yy'),
                isProjected: false
            });
        } else {
            // Missing data logic
            reportData.push({
                date: new Date(currentDate),
                netGenConsumption: null, // Or 0? User said "handle with null values"
                annualNetSurplus: null,
                netSurplusCashValue: null,
                monthLabel: format(currentDate, 'MMM-yy'),
                isProjected: true // Flag to indicate missing/projected
            });
        }

        currentDate = addMonths(currentDate, 1);
    }

    return reportData;
};
