import React from 'react';

const SentimentGauge = ({ score = 75 }) => {
    const getGaugeColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getSentimentText = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    const circumference = 2 * Math.PI * 54;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Team Sentiment Score</h3>
            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                    {/* Background circle */}
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    {/* Value arc */}
                    <circle cx="60" cy="60" r="54" fill="none"
                        stroke={getGaugeColor(score)} strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        transform="rotate(-90 60 60)" />
                    {/* Needle */}
                    <line x1="60" y1="60" x2="60" y2="20"
                        stroke={getGaugeColor(score)} strokeWidth="3"
                        transform={`rotate(${(score / 100) * 180 - 90} 60 60)`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: getGaugeColor(score) }}>
                        {score}
                    </span>
                    <span className="text-sm text-gray-500">/ 100</span>
                    <span className="text-xs font-medium mt-1" style={{ color: getGaugeColor(score) }}>
                        {getSentimentText(score)}
                    </span>
                </div>
            </div>
            <p className="text-sm text-gray-600">Based on recent employee feedback</p>
        </div>
    );
};

export default SentimentGauge;