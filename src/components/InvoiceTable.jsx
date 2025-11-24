import React from 'react';

const InvoiceTable = ({ data, settlementMonth }) => {
    const formatCurrency = (val) => {
        if (val === null || val === undefined) return '-';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatKWh = (val) => {
        if (val === null || val === undefined) return '-';
        return `${val} kWh`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-[#E2EFD9]">
                        <th className="border border-black px-2 py-1 text-center font-bold">Billing Period<br />Ending</th>
                        <th className="border border-black px-2 py-1 text-center font-bold text-green-700">Net Generation <span className="text-black">or</span><br /><span className="text-blue-600">Net Consumption</span></th>
                        <th className="border border-black px-2 py-1 text-center font-bold">Annual Net<br />Surplus (To-Date)</th>
                        <th className="border border-black px-2 py-1 text-center font-bold">Net Surplus<br />Cash Value¹</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        const isSettlementMonth = row.monthLabel.startsWith(settlementMonth?.substring(0, 3));
                        // This logic for highlighting might need refinement based on exact "Settlement Month" string match

                        // Determine color for Net Gen/Cons
                        // Assuming: Positive = Consumption (Blue), Negative = Generation (Green)
                        const isGen = row.netGenConsumption < 0;
                        const textColor = row.netGenConsumption === null ? 'text-black' : (isGen ? 'text-green-600' : 'text-blue-600');

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-black px-2 py-1 text-center">{row.monthLabel}</td>
                                <td className={`border border-black px-2 py-1 text-center font-medium ${textColor}`}>
                                    {formatKWh(row.netGenConsumption)}
                                </td>
                                <td className="border border-black px-2 py-1 text-center">{formatKWh(row.annualNetSurplus)}</td>
                                <td className="border border-black px-2 py-1 text-center">{formatCurrency(row.netSurplusCashValue)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;
