import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { RefreshCcw, TrendingUp, Users, AlertTriangle, Briefcase, Smile, ArrowUp, ArrowDown, Activity, Shield, BarChart3, Gauge } from 'lucide-react';

// Import your new chart components
import AttritionHeatmap from './components/charts/AttritionHeatmap';
import SentimentGauge from './components/charts/SentimentGauge';
import RetentionFunnel from './components/charts/RetentionFunnel';
import PredictionTimeline from './components/charts/PredictionTimeline';
import RiskSatisfactionPlot from './components/charts/RiskSatisfactionPlot';
import DepartmentRadarAnalysis from './components/charts/DepartmentRadarAnalysis';

// Base URL for the Flask backend
const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * A utility hook to fetch data from the backend API.
 * Handles loading and error states.
 */
const useFetchData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (e) {
      console.error("Fetch error:", e);
      setError('Could not fetch data. Is the Python backend running on port 5000?');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// --- Enhanced Helper Components ---

/**
 * Renders an animated stat card with trend indicators
 */
const StatCard = ({ title, value, change, icon: Icon, color, loading }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
      <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            )}
            {change !== undefined && !loading && (
              <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-rose-500' : 'text-emerald-500'}`}>
                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('text-', 'text-')}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced loading component with shimmer effect
 */
const Loader = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[200px] bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="relative">
          <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
        </div>
        <span className="text-indigo-500 font-medium mt-3">Loading Analytics...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 text-red-700 rounded-2xl shadow-lg min-h-[200px] flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 mb-3" />
        <p className="font-semibold">{error}</p>
        <p className="text-sm text-red-600 mt-1">Please check your backend connection</p>
      </div>
    );
  }
  return children;
};

/**
 * Glass morphism panel component
 */
const GlassPanel = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 ${className}`}>
    {children}
  </div>
);

// --- Your Existing Feature Components ---

/**
 * Visualizes the monthly attrition trend with enhanced design
 */
const TrendVisualization = ({ data }) => {
  const summary = data?.summary;
  const trends = data?.trends;

  // Calculate trend indicator
  const currentRate = trends?.[trends.length - 1]?.attrition_rate || 0;
  const previousRate = trends?.[trends.length - 2]?.attrition_rate || 0;
  const trendChange = previousRate ? ((currentRate - previousRate) / previousRate) * 100 : 0;

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Workforce Intelligence Dashboard
          </h2>
          <p className="text-gray-600 mt-2">Real-time insights into employee retention and attrition patterns</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <div className={`flex items-center px-3 py-1 rounded-full ${trendChange >= 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {trendChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span className="text-sm font-medium">{Math.abs(trendChange).toFixed(1)}%</span>
          </div>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Workforce" 
          value={summary?.total_employees || '...'} 
          change={2.1}
          icon={Users} 
          color="text-blue-500"
          loading={!summary}
        />
        <StatCard 
          title="YTD Resignations" 
          value={summary?.total_attrition_ytd || '...'} 
          change={-1.2}
          icon={Briefcase} 
          color="text-red-500"
          loading={!summary}
        />
        <StatCard 
          title="Attrition Rate" 
          value={`${summary?.overall_attrition_rate || 0}%`} 
          change={0.8}
          icon={TrendingUp} 
          color="text-indigo-500"
          loading={!summary}
        />
        <StatCard 
          title="Risk Level" 
          value={trendChange >= 2 ? "High" : trendChange >= 0 ? "Medium" : "Low"} 
          change={trendChange}
          icon={Activity} 
          color={trendChange >= 2 ? "text-red-500" : trendChange >= 0 ? "text-yellow-500" : "text-green-500"}
          loading={!trends}
        />
      </div>

      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Monthly Attrition Trend</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span>Attrition Rate (%)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="attritionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attrition Rate']} 
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{ 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="attrition_rate" 
              stroke="url(#attritionGradient)" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
              name="Rate (%)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassPanel>
    </div>
  );
};

/**
 * Enhanced department analysis with pie chart option
 */
const DepartmentAnalysis = ({ data }) => {
  const [view, setView] = useState('bar');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <GlassPanel className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Department Analysis</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView('bar')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              view === 'bar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bar
          </button>
          <button 
            onClick={() => setView('pie')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              view === 'pie' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pie
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {view === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="Department" 
              tick={{ fill: '#6b7280', fontSize: 10 }} 
              angle={-30} 
              textAnchor="end" 
              height={50}
              interval={0}
            />
            <YAxis 
              domain={[0, 'auto']} 
              tickFormatter={(value) => `${value}%`} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attrition Rate']} 
              contentStyle={{ 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
            />
            <Bar dataKey="AttritionRate" radius={[8, 8, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ Department, AttritionRate }) => `${Department}: ${AttritionRate}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="AttritionRate"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attrition Rate']}
              contentStyle={{ 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </GlassPanel>
  );
};

/**
 * Enhanced exit survey insights
 */
const ExitSurveyInsights = ({ data }) => {
  const reasons = data?.reasons;
  const topReason = data?.top_reason;
  
  return (
    <GlassPanel className="p-6 h-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Exit Survey Insights</h3>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-semibold text-orange-800">Priority Action Required</p>
            <p className="text-orange-700 text-sm mt-1">{topReason}</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={reasons} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `${value}%`} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            dataKey="Reason" 
            type="category" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            width={90}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentage']} 
            contentStyle={{ 
              borderRadius: '12px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}
          />
          <Bar dataKey="Percentage" radius={[0, 8, 8, 0]}>
            {reasons?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#ef4444' : '#3b82f6'} 
                fillOpacity={index === 0 ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassPanel>
  );
};

/**
 * Enhanced prediction list with risk levels
 */
const PredictionList = ({ data }) => {
  const getRiskColor = (probability) => {
    if (probability >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (probability >= 70) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getRiskLevel = (probability) => {
    if (probability >= 80) return 'Critical';
    if (probability >= 70) return 'High';
    return 'Medium';
  };

  return (
    <GlassPanel className="p-6 h-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-red-500" />
        High-Risk Employees
      </h3>
      
      {data && data.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {data.map((employee, index) => (
            <div 
              key={employee.EmployeeID}
              className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-semibold text-indigo-600">
                    #{employee.EmployeeID}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{employee.Department}</p>
                    <p className="text-xs text-gray-500">JS: {employee.JobSatisfaction} | PR: {employee.PerformanceRating}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getRiskColor(employee.AttritionProbability)}`}>
                  {getRiskLevel(employee.AttritionProbability)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attrition Probability</span>
                <span className="text-lg font-bold" style={{ 
                  color: employee.AttritionProbability >= 80 ? '#ef4444' : 
                         employee.AttritionProbability >= 70 ? '#f97316' : '#eab308'
                }}>
                  {employee.AttritionProbability}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${employee.AttritionProbability}%`,
                    backgroundColor: employee.AttritionProbability >= 80 ? '#ef4444' : 
                                    employee.AttritionProbability >= 70 ? '#f97316' : '#eab308'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Smile className="w-8 h-8 text-green-500" />
          </div>
          <p className="font-semibold text-gray-700">No Critical Risks Detected</p>
          <p className="text-sm text-gray-500 mt-1">All employees below 70% risk threshold</p>
        </div>
      )}
    </GlassPanel>
  );
};

// --- Mock Data for New Visualizations ---
const mockHeatmapData = [
  { department: 'Engineering', monthlyRates: [1.2, 0.8, 2.1, 1.5, 0.9, 1.8, 2.5, 1.2, 0.7, 1.1, 0.9, 1.3] },
  { department: 'Sales', monthlyRates: [3.2, 2.8, 4.1, 3.5, 2.9, 3.8, 4.5, 3.2, 2.7, 3.1, 2.9, 3.3] },
  { department: 'Marketing', monthlyRates: [1.8, 1.5, 2.2, 1.9, 1.4, 2.1, 2.8, 1.7, 1.3, 1.6, 1.4, 1.9] },
  { department: 'HR', monthlyRates: [0.8, 0.5, 1.1, 0.9, 0.6, 0.8, 1.2, 0.7, 0.4, 0.6, 0.5, 0.8] },
];

const mockFunnelData = [
  { name: 'Total Employees', count: 1000, percentage: 100 },
  { name: 'Satisfied', count: 750, percentage: 75 },
  { name: 'Engaged', count: 600, percentage: 60 },
  { name: 'High Retention', count: 550, percentage: 55 },
];

const mockForecastData = [
  { month: 'Jan', predicted: 2.1, actual: 2.0 },
  { month: 'Feb', predicted: 2.3, actual: 2.2 },
  { month: 'Mar', predicted: 2.6, actual: 2.5 },
  { month: 'Apr', predicted: 2.8, actual: null },
  { month: 'May', predicted: 3.1, actual: null },
  { month: 'Jun', predicted: 3.3, actual: null },
];

const mockRiskData = [
  { satisfaction: 85, risk: 15, tenure: 24, department: 'Engineering' },
  { satisfaction: 45, risk: 75, tenure: 6, department: 'Sales' },
  { satisfaction: 70, risk: 35, tenure: 18, department: 'Marketing' },
  { satisfaction: 90, risk: 10, tenure: 36, department: 'HR' },
  { satisfaction: 30, risk: 85, tenure: 3, department: 'Sales' },
];

// --- New Visualization Sections ---

const AdvancedAnalyticsSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttritionHeatmap data={mockHeatmapData} />
        <SentimentGauge score={75} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetentionFunnel data={mockFunnelData} />
        <DepartmentRadarAnalysis />
      </div>
    </div>
  );
};
const PredictiveInsightsSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionTimeline data={mockForecastData} />
        <RiskSatisfactionPlot data={mockRiskData} />
      </div>
      
      <GlassPanel className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Machine Learning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <div className="text-sm text-blue-800">Model Accuracy</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-green-800">Recall Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">23</div>
            <div className="text-sm text-purple-800">Key Features</div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

// --- Navigation Tabs Component ---
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Advanced Analytics', icon: Gauge },
    { id: 'predictions', label: 'Predictive Insights', icon: TrendingUp },
  ];

  return (
    <nav className="mb-8">
      <div className="flex space-x-1 bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-lg border border-white/20">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- Main Application Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: trendData, loading: trendLoading, error: trendError, refetch: refetchTrends } = useFetchData('trends');
  const { data: deptData, loading: deptLoading, error: deptError, refetch: refetchDepts } = useFetchData('departments');
  const { data: insightData, loading: insightLoading, error: insightError, refetch: refetchInsights } = useFetchData('insights');
  const { data: predData, loading: predLoading, error: predError, refetch: refetchPreds } = useFetchData('predictions');
  
  const allLoading = trendLoading || deptLoading || insightLoading || predLoading;
  const anyError = trendError || deptError || insightError || predError;

  const handleRefreshAll = () => {
    refetchTrends();
    refetchDepts();
    refetchInsights();
    refetchPreds();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
            <Loader loading={trendLoading} error={trendError}>
              {trendData && <TrendVisualization data={trendData} />}
            </Loader>

            <div className="lg:col-span-1">
              <Loader loading={deptLoading} error={deptError}>
                {deptData && <DepartmentAnalysis data={deptData} />}
              </Loader>
            </div>

            <div className="lg:col-span-1">
              <Loader loading={insightLoading} error={insightError}>
                {insightData && <ExitSurveyInsights data={insightData} />}
              </Loader>
            </div>
            
            <div className="lg:col-span-1">
              <Loader loading={predLoading} error={predError}>
                {predData && <PredictionList data={predData} />}
              </Loader>
            </div>
          </div>
        );
      
      case 'analytics':
        return <AdvancedAnalyticsSection />;
      
      case 'predictions':
        return <PredictiveInsightsSection />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans p-4 md:p-8">
      
      <header className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              HR Intelligence Platform
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Advanced analytics for workforce retention and strategic planning</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <button 
              onClick={handleRefreshAll} 
              disabled={allLoading}
              className={`flex items-center px-6 py-3 text-base font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                allLoading 
                  ? 'bg-indigo-300 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <RefreshCcw className={`w-5 h-5 mr-2 ${allLoading ? 'animate-spin' : ''}`} />
              {allLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Live Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">ML Powered Predictions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Real-time Analytics</span>
          </div>
        </div>
      </header>

      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {renderTabContent()}
      </main>

      <footer className="mt-12 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <p className="text-gray-600 font-medium">HR Analytics Intelligence Platform</p>
          <p className="text-gray-500 text-sm mt-1">Powered by Machine Learning • Real-time Insights • Strategic Workforce Planning</p>
          <div className="mt-3 flex justify-center space-x-6 text-xs text-gray-400">
            <span>🔒 Secure</span>
            <span>⚡ Real-time</span>
            <span>🤖 AI-Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}