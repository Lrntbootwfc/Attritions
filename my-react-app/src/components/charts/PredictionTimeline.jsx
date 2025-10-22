import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const PredictionTimeline = ({ data }) => {
    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value ? `${entry.value}%` : 'No data'}
                            {entry.dataKey === 'predicted' && !entry.payload.actual && (
                                <span className="ml-2 text-xs text-orange-500">(Forecast)</span>
                            )}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Custom dot for actual data points
    const renderDot = (props) => {
        const { cx, cy, payload } = props;
        if (payload.actual !== null) {
            return (
                <circle
                    key={`dot-${payload.month}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#10b981"
                    stroke="#fff"
                    strokeWidth={2}
                />
            );
        }
        return null;
    };

    // Custom active dot for predictions
    const renderActiveDot = (props) => {
        const { cx, cy, payload } = props;
        if (payload.actual === null) {
            return (
                <circle
                    key={`active-dot-${payload.month}`}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#f59e0b"
                    stroke="#fff"
                    strokeWidth={2}
                />
            );
        }
        return (
            <circle
                key={`active-dot-${payload.month}`}
                cx={cx}
                cy={cy}
                r={6}
                fill="#10b981"
                stroke="#fff"
                strokeWidth={2}
            />
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                        6-Month Attrition Forecast
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Historical data vs ML predictions</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Monthly View</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={false}
                    />

                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                        axisLine={false}
                        domain={[0, 'dataMax + 0.5']}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-sm text-gray-600">{value}</span>
                        )}
                    />

                    {/* Actual Data Area */}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#actualGradient)"
                        name="Actual"
                        dot={renderDot}
                        activeDot={renderActiveDot}
                        connectNulls={false}
                    />

                    {/* Predicted Data Area */}
                    <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fill="url(#predictedGradient)"
                        name="Predicted"
                        dot={renderDot}
                        activeDot={renderActiveDot}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Forecast Statistics */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <span className="text-green-800 font-medium">Current Rate</span>
                        <span className="text-green-600 font-bold">
                            {data?.find(d => d.actual !== null && d.actual !== undefined)?.actual || 'N/A'}%
                        </span>
                    </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <span className="text-orange-800 font-medium">Peak Forecast</span>
                        <span className="text-orange-600 font-bold">
                            {Math.max(...(data?.map(d => d.predicted).filter(Boolean) || [0]))}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Forecast Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    </div>
                    <p className="text-sm text-blue-700 ml-2">
                        Forecast based on historical trends, seasonality patterns, and current workforce metrics.
                        Model confidence: 87%.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PredictionTimeline;