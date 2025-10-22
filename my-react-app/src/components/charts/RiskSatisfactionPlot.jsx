import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis, Legend } from 'recharts';
import { Target, TrendingUp, User } from 'lucide-react';

const RiskSatisfactionPlot = ({ data }) => {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        <p className="font-semibold text-gray-800">{data.department}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Satisfaction:</span>
                            <span className="font-medium" style={{ color: data.risk > 70 ? '#ef4444' : data.risk > 50 ? '#f59e0b' : '#10b981' }}>
                                {data.satisfaction}/100
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Risk:</span>
                            <span className="font-medium" style={{ color: data.risk > 70 ? '#ef4444' : data.risk > 50 ? '#f59e0b' : '#10b981' }}>
                                {data.risk}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tenure:</span>
                            <span className="font-medium text-gray-800">{data.tenure} months</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Get risk level for color coding
    const getRiskLevel = (risk) => {
        if (risk >= 70) return { level: 'Critical', color: '#ef4444', bg: '#fef2f2' };
        if (risk >= 50) return { level: 'High', color: '#f59e0b', bg: '#fffbeb' };
        return { level: 'Low', color: '#10b981', bg: '#f0fdf4' };
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-indigo-500" />
                        Risk vs Satisfaction Analysis
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Employee distribution by satisfaction and attrition risk</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Interactive</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <ScatterChart
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

                    <XAxis
                        dataKey="satisfaction"
                        name="Job Satisfaction"
                        type="number"
                        domain={[0, 100]}
                        tickCount={6}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        label={{
                            value: 'Job Satisfaction Score',
                            position: 'insideBottom',
                            offset: -5,
                            fill: '#374151',
                            fontSize: 12
                        }}
                    />

                    <YAxis
                        dataKey="risk"
                        name="Attrition Risk"
                        type="number"
                        domain={[0, 100]}
                        tickCount={6}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                        label={{
                            value: 'Attrition Risk %',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10,
                            fill: '#374151',
                            fontSize: 12
                        }}
                    />

                    <ZAxis
                        dataKey="tenure"
                        range={[50, 400]}
                        name="Tenure"
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                    <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => (
                            <span className="text-sm text-gray-600">{value}</span>
                        )}
                    />

                    <Scatter
                        name="Employees"
                        data={data}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => {
                            const riskInfo = getRiskLevel(entry.risk);
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={riskInfo.color}
                                    stroke={riskInfo.color}
                                    strokeWidth={1}
                                    opacity={0.8}
                                    r={8 + (entry.tenure / 12)} // Size based on tenure
                                />
                            );
                        })}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>

            {/* Risk Level Legend */}
            <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-3 h-3 bg-red-500 rounded-full mb-2"></div>
                    <span className="text-xs font-medium text-red-800">Critical Risk</span>
                    <span className="text-xs text-red-600">70%+</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2"></div>
                    <span className="text-xs font-medium text-yellow-800">High Risk</span>
                    <span className="text-xs text-yellow-600">50-69%</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full mb-2"></div>
                    <span className="text-xs font-medium text-green-800">Low Risk</span>
                    <span className="text-xs text-green-600">0-49%</span>
                </div>
            </div>

            {/* Insights */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Key Insights
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Lower satisfaction strongly correlates with higher attrition risk</li>
                    <li>• Employees in top-right quadrant are retention priorities</li>
                    <li>• Larger circles indicate longer tenure employees</li>
                </ul>
            </div>
        </div>
    );
};

export default RiskSatisfactionPlot;