import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

const DepartmentRadarAnalysis = () => {
    // Mock data for radar chart
    const radarData = [
        { subject: 'Job Satisfaction', Engineering: 85, Sales: 45, Marketing: 70, HR: 90 },
        { subject: 'Employee Engagement', Engineering: 80, Sales: 50, Marketing: 75, HR: 85 },
        { subject: 'Retention Rate', Engineering: 90, Sales: 30, Marketing: 65, HR: 95 },
        { subject: 'Performance', Engineering: 88, Sales: 75, Marketing: 70, HR: 82 },
        { subject: 'Growth Opportunity', Engineering: 85, Sales: 60, Marketing: 65, HR: 70 },
        { subject: 'Work-Life Balance', Engineering: 70, Sales: 55, Marketing: 80, HR: 88 },
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`radar-tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Department performance summary
    const departmentSummary = [
        { department: 'Engineering', score: 83, trend: '+2%', color: '#0088FE' },
        { department: 'Sales', score: 53, trend: '-5%', color: '#00C49F' },
        { department: 'Marketing', score: 71, trend: '+1%', color: '#FFBB28' },
        { department: 'HR', score: 85, trend: '+3%', color: '#FF8042' },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-indigo-500" />
                        Department Performance Radar
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Multi-dimensional performance comparison</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Overall View</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickLine={false}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 10 }}
                        tickCount={6}
                    />

                    <Radar
                        name="Engineering"
                        dataKey="Engineering"
                        stroke="#0088FE"
                        fill="#0088FE"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="Sales"
                        dataKey="Sales"
                        stroke="#00C49F"
                        fill="#00C49F"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="Marketing"
                        dataKey="Marketing"
                        stroke="#FFBB28"
                        fill="#FFBB28"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="HR"
                        dataKey="HR"
                        stroke="#FF8042"
                        fill="#FF8042"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-xs text-gray-600">{value}</span>
                        )}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Department Performance Summary */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                {departmentSummary.map((dept, index) => (
                    <div key={`dept-summary-${index}`} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: dept.color }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{dept.score}%</div>
                                <div className={`text-xs ${dept.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {dept.trend}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Key Insights */}
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Performance Insights</h4>
                <ul className="text-xs text-indigo-700 space-y-1">
                    <li>• HR leads in retention and satisfaction metrics</li>
                    <li>• Sales shows improvement opportunities in engagement</li>
                    <li>• Engineering maintains strong performance across all areas</li>
                </ul>
            </div>
        </div>
    );
};

export default DepartmentRadarAnalysis;