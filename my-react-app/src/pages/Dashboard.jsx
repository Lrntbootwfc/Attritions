import React, { useState } from 'react';
import AdvancedAnalytics from './components/sections/AdvancedAnalytics';
import PredictiveInsights from './components/sections/PredictiveInsights';
import GeographicView from './components/sections/GeographicView';

// Import your existing components
import TrendVisualization from './components/TrendVisualization';
import DepartmentAnalysis from './components/DepartmentAnalysis';
import ExitSurveyInsights from './components/ExitSurveyInsights';
import PredictionList from './components/PredictionList';

const App = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - replace with actual API calls
    const heatmapData = [
        { department: 'Engineering', monthlyRates: [1.2, 0.8, 2.1, 1.5, 0.9, 1.8, 2.5, 1.2, 0.7, 1.1, 0.9, 1.3] },
        { department: 'Sales', monthlyRates: [3.2, 2.8, 4.1, 3.5, 2.9, 3.8, 4.5, 3.2, 2.7, 3.1, 2.9, 3.3] },
        { department: 'Marketing', monthlyRates: [1.8, 1.5, 2.2, 1.9, 1.4, 2.1, 2.8, 1.7, 1.3, 1.6, 1.4, 1.9] },
        { department: 'HR', monthlyRates: [0.8, 0.5, 1.1, 0.9, 0.6, 0.8, 1.2, 0.7, 0.4, 0.6, 0.5, 0.8] },
    ];

    const funnelData = [
        { name: 'Total Employees', count: 1000, percentage: 100 },
        { name: 'Satisfied', count: 750, percentage: 75 },
        { name: 'Engaged', count: 600, percentage: 60 },
        { name: 'High Retention', count: 550, percentage: 55 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans p-4 md:p-8">
            {/* Enhanced Header with Navigation */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            HR Intelligence Platform
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">Advanced analytics for workforce retention</p>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="mt-4 lg:mt-0">
                        <div className="flex space-x-1 bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-lg">
                            {['overview', 'analytics', 'predictions', 'geographic'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${activeTab === tab
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Tab Content */}
            <main>
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
                        {/* Your existing overview components */}
                        <TrendVisualization data={trendData} />
                        <DepartmentAnalysis data={deptData} />
                        <ExitSurveyInsights data={insightData} />
                        <PredictionList data={predData} />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <AdvancedAnalytics
                        heatmapData={heatmapData}
                        sentimentData={75}
                        funnelData={funnelData}
                        radarData={radarData}
                    />
                )}

                {activeTab === 'predictions' && (
                    <PredictiveInsights
                        forecastData={forecastData}
                        riskData={riskData}
                    />
                )}

                {activeTab === 'geographic' && (
                    <GeographicView
                        mapData={mapData}
                        distributionData={distributionData}
                    />
                )}
            </main>
        </div>
    );
};

export default App;