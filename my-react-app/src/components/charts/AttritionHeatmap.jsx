import React from 'react';

const AttritionHeatmap = ({ data }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Attrition Heatmap</h3>
            <div className="grid grid-cols-13 gap-1">
                <div className="col-span-1"></div>
                {months.map(month => (
                    <div key={month} className="text-xs font-medium text-gray-600 text-center py-2">
                        {month}
                    </div>
                ))}

                {data?.map((dept, deptIndex) => (
                    <React.Fragment key={deptIndex}>
                        <div className="text-sm font-medium text-gray-700 py-2 truncate">
                            {dept.department}
                        </div>
                        {dept.monthlyRates.map((rate, monthIndex) => (
                            <div
                                key={monthIndex}
                                className={`h-8 rounded transition-all hover:scale-110 cursor-pointer flex items-center justify-center ${rate > 4 ? 'bg-red-500 text-white' :
                                        rate > 2 ? 'bg-orange-400 text-white' :
                                            rate > 1 ? 'bg-yellow-400 text-gray-800' :
                                                'bg-green-400 text-white'
                                    }`}
                                title={`${dept.department} - ${months[monthIndex]}: ${rate}%`}
                            >
                                <span className="text-xs font-semibold">{rate}%</span>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-center mt-4 space-x-4 text-xs">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded mr-1"></div>
                    <span>Low (&lt;1%)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded mr-1"></div>
                    <span>Medium (1-2%)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-400 rounded mr-1"></div>
                    <span>High (2-4%)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
                    <span>Critical (&gt;4%)</span>
                </div>
            </div>
        </div>
    );
};

export default AttritionHeatmap;