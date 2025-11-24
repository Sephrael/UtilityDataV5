import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

const BulkExport = ({ accounts, onExport }) => {
    const accountIds = Object.keys(accounts);
    const [selectedAccounts, setSelectedAccounts] = useState(accountIds);
    const [startMonth, setStartMonth] = useState(0); // Jan
    const [startYear, setStartYear] = useState(new Date().getFullYear() - 1);
    const [endMonth, setEndMonth] = useState(11); // Dec
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    const [isExporting, setIsExporting] = useState(false);

    const handleToggleAccount = (id) => {
        if (selectedAccounts.includes(id)) {
            setSelectedAccounts(selectedAccounts.filter(acc => acc !== id));
        } else {
            setSelectedAccounts([...selectedAccounts, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedAccounts.length === accountIds.length) {
            setSelectedAccounts([]);
        } else {
            setSelectedAccounts(accountIds);
        }
    };

    const handleExportClick = async () => {
        if (selectedAccounts.length === 0) {
            alert("Please select at least one account.");
            return;
        }

        setIsExporting(true);

        // Calculate all months in range
        const startDate = new Date(startYear, startMonth, 1);
        const endDate = new Date(endYear, endMonth, 1);

        if (startDate > endDate) {
            alert("Start date must be before end date.");
            setIsExporting(false);
            return;
        }

        const monthsToExport = [];
        let current = startDate;
        while (current <= endDate) {
            monthsToExport.push({
                month: current.getMonth(),
                year: current.getFullYear()
            });
            current = addMonths(current, 1);
        }

        await onExport(selectedAccounts, monthsToExport);
        setIsExporting(false);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bulk PDF Export</h2>

            {/* Account Selection */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Select Accounts</label>
                    <button onClick={handleSelectAll} className="text-xs text-blue-600 hover:underline">
                        {selectedAccounts.length === accountIds.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                    {accountIds.map(id => (
                        <label key={id} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedAccounts.includes(id)}
                                onChange={() => handleToggleAccount(id)}
                                className="rounded text-green-600 focus:ring-green-500"
                            />
                            <span>{id}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Date Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="flex gap-2">
                        <select
                            value={startMonth}
                            onChange={(e) => setStartMonth(parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        >
                            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="flex gap-2">
                        <select
                            value={endMonth}
                            onChange={(e) => setEndMonth(parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        >
                            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select
                            value={endYear}
                            onChange={(e) => setEndYear(parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={handleExportClick}
                disabled={isExporting}
                className={`w-full py-3 rounded-md text-white font-medium transition-colors ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isExporting ? 'Generating PDFs...' : 'Export PDF Bundle (ZIP)'}
            </button>
        </div>
    );
};

export default BulkExport;
