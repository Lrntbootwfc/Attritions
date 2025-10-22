import React from 'react';
import PredictionTimeline from '../charts/PredictionTimeline';
import RiskSatisfactionPlot from '../charts/RiskSatisfactionPlot';

const PredictiveInsights = ({ forecastData, riskData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictionTimeline data={forecastData} />
                <RiskSatisfactionPlot data={riskData} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Add more predictive charts here */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Machine Learning Insights</h3>
                    <p className="text-gray-600">Advanced predictive models analyzing workforce trends...</p>
                </div>
            </div>
        </div>
    );
};

export default PredictiveInsights;