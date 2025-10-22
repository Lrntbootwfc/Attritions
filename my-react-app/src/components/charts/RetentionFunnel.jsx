import React from 'react';
import { Filter, Users, Heart, Target, Shield } from 'lucide-react';

const RetentionFunnel = ({ data }) => {
    // Calculate conversion rates between stages
    const calculateConversionRates = () => {
        const rates = [];
        for (let i = 0; i < data.length - 1; i++) {
            const current = data[i];
            const next = data[i + 1];
            const rate = ((next.count / current.count) * 100).toFixed(1);
            rates.push(rate);
        }
        return rates;
    };

    const conversionRates = calculateConversionRates();

    // Get stage icon
    const getStageIcon = (stageName) => {
        const icons = {
            'Total Employees': Users,
            'Satisfied': Heart,
            'Engaged': Target,
            'High Retention': Shield,
        };
        const IconComponent = icons[stageName] || Filter;
        return <IconComponent className="w-4 h-4" />;
    };

    // Get stage color
    const getStageColor = (index) => {
        const colors = [
            { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
            { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
            { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
            { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' },
        ];
        return colors[index] || colors[0];
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-indigo-500" />
                        Employee Retention Funnel
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Employee journey from hiring to high retention</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{data[data.length - 1]?.percentage}%</div>
                    <div className="text-sm text-gray-500">Final Retention Rate</div>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-4">
                {data.map((stage, index) => {
                    const color = getStageColor(index);
                    const isLast = index === data.length - 1;
                    const conversionRate = conversionRates[index - 1];

                    return (
                        <div key={stage.name} className="relative">
                            {/* Conversion Rate Arrow */}
                            {index > 0 && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${color.light} ${color.text} ${color.border} border`}>
                                        {conversionRate}% →
                                    </div>
                                </div>
                            )}

                            {/* Funnel Stage */}
                            <div className={`flex items-center p-4 rounded-xl border-2 ${color.border} ${color.light} transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}>
                                <div className={`p-2 rounded-lg ${color.bg} bg-opacity-10`}>
                                    <div className={`${color.text}`}>
                                        {getStageIcon(stage.name)}
                                    </div>
                                </div>

                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{stage.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {stage.count} employees • {stage.percentage}% of total
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">{stage.percentage}%</div>
                                            {!isLast && (
                                                <div className="text-xs text-gray-500">
                                                    ↓ {conversionRate}% conversion
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-1000 ${color.bg}`}
                                            style={{ width: `${stage.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Drop Indicator */}
                            {!isLast && (
                                <div className="flex justify-center">
                                    <div className="w-0 h-4 border-l-2 border-dashed border-gray-300"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Funnel Statistics */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">Total Attrition</span>
                        <span className="text-blue-600 font-bold">
                            {data[0].count - data[data.length - 1].count} employees
                        </span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                        {((1 - data[data.length - 1].count / data[0].count) * 100).toFixed(1)}% of workforce
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                        <span className="text-green-800 font-medium">Overall Retention</span>
                        <span className="text-green-600 font-bold">
                            {data[data.length - 1].percentage}%
                        </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                        Industry avg: 65%
                    </div>
                </div>
            </div>

            {/* Actionable Insights */}
            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Improvement Opportunities
                </h4>
                <div className="text-sm text-orange-700 space-y-2">
                    <div className="flex justify-between">
                        <span>Satisfaction → Engagement:</span>
                        <span className="font-medium">{conversionRates[1]}% conversion</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Biggest drop:</span>
                        <span className="font-medium">
                            {data.reduce((maxDrop, stage, i, arr) => {
                                if (i === 0) return { drop: 0, from: '' };
                                const drop = arr[i - 1].percentage - stage.percentage;
                                return drop > maxDrop.drop ? { drop, from: arr[i - 1].name } : maxDrop;
                            }, { drop: 0, from: '' }).from}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetentionFunnel;