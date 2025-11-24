import React, { useState, useEffect } from 'react';
import { format, addMonths, getMonth, getYear } from 'date-fns';

const ReportSelector = ({ accounts, onGenerate, onExportPDF }) => {
    const accountIds = Object.keys(accounts);
    const [selectedAccount, setSelectedAccount] = useState(accountIds[0] || '');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Update logic when account changes
    useEffect(() => {
        if (selectedAccount && accounts[selectedAccount]) {
            const records = accounts[selectedAccount].records;
            if (records.length > 0) {
                const lastRecord = records[records.length - 1];
                // Default to the month AFTER the last record, as per requirements
                // "If only 12 months of data have been provided, then the month following that 12th month should be the only available option."
                // This implies the report is usually for the *next* billing cycle or the current one just finished?
                // Let's default to next month.
                const nextMonthDate = addMonths(lastRecord.date, 1);
                setMonth(getMonth(nextMonthDate)); // 0-11
                setYear(getYear(nextMonthDate));
            } else {
                const now = new Date();
                setMonth(getMonth(now));
                setYear(getYear(now));
            }
        }
    }, [selectedAccount, accounts]);

    const handleGenerate = () => {
        if (selectedAccount && month !== '' && year !== '') {
            onGenerate({
                accountId: selectedAccount,
                month: parseInt(month),
                year: parseInt(year)
            });
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Report Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                    <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                    >
                        {accountIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                    >
                        {months.map((m, idx) => (
                            <option key={idx} value={idx}>{m}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleGenerate}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-center"
                    >
                        Generate
                    </button>

                    <button
                        onClick={() => onExportPDF && onExportPDF()}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
                    >
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportSelector;
