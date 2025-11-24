import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const InvoiceCharts = ({ data }) => {
    // Prepare data for charts
    // Chart 1: Net Generation (Green) vs Net Consumption (Blue)
    // We need to split the single value into two for coloring or use Cell.

    const chartData = data.map(d => ({
        name: d.monthLabel,
        val: d.netGenConsumption || 0,
        cash: d.netSurplusCashValue || 0,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Chart 1: Net Gen / Cons */}
            <div className="border border-green-800 p-4 bg-white">
                <h3 className="text-center text-blue-500 font-semibold mb-4 text-sm">
                    <span className="text-green-500">Net Generation</span> or <span className="text-blue-500">Net Consumption</span>
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} interval={0} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar dataKey="val">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.val < 0 ? '#4ade80' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Net Surplus Cash Value */}
            <div className="border border-green-800 p-4 bg-white">
                <h3 className="text-center text-black font-semibold mb-4 text-sm">Net Surplus Cash Value</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} interval={0} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val}`} />
                            <Tooltip formatter={(value) => [`$${value}`, 'Cash Value']} />
                            <Bar dataKey="cash" fill="#bbf7d0" stroke="#166534" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default InvoiceCharts;
