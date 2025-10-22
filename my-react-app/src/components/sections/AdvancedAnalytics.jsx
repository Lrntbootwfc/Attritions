import React from 'react';
import AttritionHeatmap from '../charts/AttritionHeatmap';
import SentimentGauge from '../charts/SentimentGauge';
import RetentionFunnel from '../charts/RetentionFunnel';
import DepartmentRadar from '../charts/DepartmentRadarAnalysis';

const AdvancedAnalytics = ({ heatmapData, sentimentData, funnelData, radarData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttritionHeatmap data={heatmapData} />
                <SentimentGauge score={sentimentData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RetentionFunnel data={funnelData} />
                <DepartmentRadar data={radarData} />
            </div>
        </div>
    );
};

export default AdvancedAnalytics;