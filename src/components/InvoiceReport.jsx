import React from 'react';
import InvoiceTable from './InvoiceTable';
import InvoiceCharts from './InvoiceCharts';
import { format } from 'date-fns';
import logo from '../assets/logo.jpg';

const InvoiceReport = ({ data, accountInfo, reportDate }) => {
    const { accountId, serviceAddress, mailingAddress, settlementMonth } = accountInfo;

    // Format mailing address lines
    // Combine City and State/Zip if possible
    let mailingLines = mailingAddress ? mailingAddress.split(',').map(s => s.trim()) : [];
    if (mailingLines.length > 1) {
        const last = mailingLines.pop();
        const secondLast = mailingLines.pop();
        // Check if last looks like "State Zip" (e.g. CA 94306)
        // Simple heuristic: if it has numbers and is short, it's likely the zip part.
        mailingLines.push(`${secondLast}, ${last}`);
    }

    return (
        <div className="bg-white p-8 max-w-5xl mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-4 border-green-800 pb-4 bg-[#E2EFD9] p-6 rounded-t-lg -mx-8 -mt-8">
                <div className="flex items-center">
                    <img src={logo} alt="City of Palo Alto Utilities" className="h-20 object-contain" />
                </div>
                <h1 className="text-3xl font-medium text-black mt-2">Electric Net Metering Statement</h1>
            </div>

            {/* Address & Info */}
            <div className="flex justify-between mb-8 text-sm">
                <div className="w-1/2">
                    {mailingLines.map((line, i) => (
                        <div key={i} className="font-medium text-gray-800">{line}</div>
                    ))}
                </div>
                <div className="w-1/2 text-right">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 justify-end">
                        <span className="font-bold text-gray-900">Statement Date:</span>
                        <span>{format(reportDate, 'MM/dd/yyyy')}</span>

                        <span className="font-bold text-gray-900">Account #:</span>
                        <span>{accountId}</span>

                        <span className="font-bold text-gray-900">Service Address:</span>
                        <span>{serviceAddress}</span>
                    </div>
                </div>
            </div>

            {/* Explanatory Text */}
            <p className="text-xs text-gray-600 mb-6 text-justify">
                This statement shows your net electricity consumption or generation for the previous twelve months, as well as your Net Surplus Cash Value under election A. For more information on the City of Palo Alto Utilities' Net Energy Metering policies, please visit <a href="#" className="text-blue-600 underline">www.cityofpaloalto.org/net-metering</a>. If you should have any questions about your Net Metering Credits or Balance, please either call Customer Service at 650-329-2161 or send an email to UtilitiesCustomerService@CityofPaloAlto.org.
            </p>

            {/* Election Header */}
            <h2 className="text-2xl font-medium mb-2">Election A (Settlement Month = {settlementMonth})</h2>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Table */}
                <div className="flex-1">
                    <InvoiceTable data={data} settlementMonth={settlementMonth} />
                </div>

                {/* Right: Info Box */}
                <div className="w-full lg:w-64 flex flex-col gap-4">
                    <p className="text-[10px] text-gray-600 leading-tight">
                        ¹Net Surplus Cash Value is calculated based on the customer's Annual Net Surplus since their previous settlement date, valued at the Net Surplus Compensation Rate. Net Surplus Cash Value will be credited to customers at their annual settlement month, and the Annual Net Surplus will then be reset to zero (allow 2 billing periods for credit to appear).
                    </p>

                    <div className="border border-black bg-[#E2EFD9] p-0 text-xs">
                        <div className="font-bold text-center border-b border-black py-1">Net Surplus Electricity</div>
                        <div className="grid grid-cols-2 text-center">
                            <div className="font-bold border-r border-black py-1">Fiscal Year</div>
                            <div className="font-bold py-1">Compensation Rate</div>
                        </div>
                        <div className="grid grid-cols-2 text-center border-t border-black">
                            <div className="border-r border-black py-1">2023</div>
                            <div className="py-1">0.1026 $/kWh</div>
                        </div>
                        <div className="grid grid-cols-2 text-center border-t border-black">
                            <div className="border-r border-black py-1">2024</div>
                            <div className="py-1">0.1535 $/kWh</div>
                        </div>
                    </div>

                    {/* Dynamic Callout Box */}
                    <div className="border border-red-500 p-2 text-xs text-gray-800 relative">
                        <div className="absolute -left-3 top-1/2 w-3 h-[1px] bg-red-500"></div>
                        {(() => {
                            // Find the record that matches the settlement month
                            // settlementMonth is a string like "March" or "October"
                            // row.monthLabel is like "Mar-23" or "Oct-23"
                            const settlementRecord = data.find(row => {
                                // Check if monthLabel starts with the first 3 letters of settlementMonth
                                return row.monthLabel.startsWith(settlementMonth.substring(0, 3));
                            });

                            const creditAmount = settlementRecord ? settlementRecord.netSurplusCashValue : 0;
                            // Use full month name and year
                            const creditDate = settlementRecord ? format(settlementRecord.date, 'MMMM yyyy') : 'N/A';

                            // Next settlement year logic
                            let nextSettlementYear = '';
                            if (settlementRecord) {
                                nextSettlementYear = parseInt(format(settlementRecord.date, 'yyyy')) + 1;
                            } else {
                                // Fallback
                                nextSettlementYear = parseInt(format(reportDate, 'yyyy'));
                            }

                            return (
                                <p>
                                    ${creditAmount || 0} credited to customer in {creditDate}. Next settlement month will be {settlementMonth} {nextSettlementYear}.
                                </p>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <InvoiceCharts data={data} />
        </div>
    );
};

export default InvoiceReport;
