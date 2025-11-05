import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { RefreshCcw, TrendingUp, Users, AlertTriangle, Briefcase, Smile, ArrowUp, ArrowDown, Activity, Shield, BarChart3, Gauge, Target, Filter } from 'lucide-react';

// Import your chart components
import AttritionHeatmap from './components/charts/AttritionHeatmap';
import SentimentGauge from './components/charts/SentimentGauge';
import RetentionFunnel from './components/charts/RetentionFunnel';
import PredictionTimeline from './components/charts/PredictionTimeline';
import RiskSatisfactionPlot from './components/charts/RiskSatisfactionPlot';
import DepartmentRadarAnalysis from './components/charts/DepartmentRadarAnalysis';

// Import 3D components
import ThreeScene from './components/charts/3d/ThreeScene';
import FloatingCards from './components/charts/3d/FloatingCards';
import AnimatedPieChart from './components/charts/3d/AnimatedPieChart';

// Import 3D hooks and styles
import { use3DTilt, useParallax } from './hooks/use3dEffects';
import './styles/3d.css';

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

// --- Enhanced Helper Components with 3D Effects ---

/**
 * Renders an animated stat card with 3D effects
 */
const StatCard = ({ title, value, change, icon: Icon, color, loading }) => {
  const [rotation, cardRef] = use3DTilt(8);
  
  const isPositive = change >= 0;
  
  return (
    <div 
      ref={cardRef}
      className="relative group perspective-1000"
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.2s ease'
      }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 opacity-0 group-hover:opacity-100 blur transition-all duration-300 rounded-2xl"></div>
      <div className="relative bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/40 transition-all duration-300 hover:shadow-2xl glass-3d-hover transform-3d">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            {loading ? (
              <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {value}
              </p>
            )}
            {change !== undefined && !loading && (
              <div className={`flex items-center mt-2 text-sm font-semibold ${isPositive ? 'text-rose-500' : 'text-emerald-500'}`}>
                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg float-slow`}>
            <Icon className={`w-6 h-6 text-white`} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced loading component with 3D shimmer effect
 */
const Loader = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[200px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 glass-3d pulse-3d">
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
      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 text-red-700 rounded-2xl shadow-2xl min-h-[200px] flex flex-col items-center justify-center glass-3d-hover">
        <AlertTriangle className="w-8 h-8 mb-3" />
        <p className="font-semibold">{error}</p>
        <p className="text-sm text-red-600 mt-1">Please check your backend connection</p>
      </div>
    );
  }
  return children;
};

/**
 * Glass morphism panel component with 3D effects
 */
const GlassPanel = ({ children, className = "", intensity = 3 }) => {
  const [rotation, panelRef] = use3DTilt(intensity);
  
  return (
    <div 
      ref={panelRef}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 glass-3d glass-3d-hover transform-3d ${className}`}
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

// --- Enhanced Feature Components with 3D ---

/**
 * Visualizes the monthly attrition trend with enhanced 3D design
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
          <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-3d">
            Workforce Intelligence Platform
          </h2>
          <p className="text-gray-600 mt-3 text-lg font-medium">Real-time insights into employee retention and attrition patterns</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <div className={`flex items-center px-4 py-2 rounded-full shadow-lg ${trendChange >= 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} float-slow`}>
            {trendChange >= 0 ? <TrendingUp className="w-4 h-4 mr-2" /> : <ArrowDown className="w-4 h-4 mr-2" />}
            <span className="text-sm font-bold">{Math.abs(trendChange).toFixed(1)}%</span>
          </div>
          <span className="text-sm text-gray-500 font-medium">vs last month</span>
        </div>
      </div>

      {/* 3D Floating Cards Section */}
      <FloatingCards />

      <GlassPanel className="p-6" intensity={2}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-indigo-500" />
            Monthly Attrition Trend
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <span className="font-semibold">Attrition Rate (%)</span>
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
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attrition Rate']} 
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{ 
                borderRadius: '12px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid #e5e7eb',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                fontWeight: 'bold'
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
 * Enhanced department analysis with 3D pie chart option
 */
const DepartmentAnalysis = ({ data }) => {
  const [view, setView] = useState('3d');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Convert data for 3D pie chart
  const pieData3D = data?.map((item, index) => ({
    name: item.Department,
    value: parseFloat(item.AttritionRate),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <GlassPanel className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" />
          Department Analysis
        </h3>
        <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
          <button 
            onClick={() => setView('3d')}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-all btn-3d ${
              view === '3d' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            3D
          </button>
          <button 
            onClick={() => setView('bar')}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-all btn-3d ${
              view === 'bar' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bar
          </button>
          <button 
            onClick={() => setView('pie')}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-all btn-3d ${
              view === 'pie' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pie
          </button>
        </div>
      </div>
      
      {view === '3d' ? (
        <div className="h-80">
          <AnimatedPieChart data={pieData3D} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {view === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="Department" 
                tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} 
                angle={-30} 
                textAnchor="end" 
                height={50}
                interval={0}
              />
              <YAxis 
                domain={[0, 'auto']} 
                tickFormatter={(value) => `${value}%`} 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Attrition Rate']} 
                contentStyle={{ 
                  borderRadius: '12px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  fontWeight: 'bold'
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
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  fontWeight: 'bold'
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </GlassPanel>
  );
};

// --- Mock Data ---
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

const mockDepartmentData = [
  { Department: 'Engineering', AttritionRate: 12.5 },
  { Department: 'Sales', AttritionRate: 25.3 },
  { Department: 'Marketing', AttritionRate: 18.7 },
  { Department: 'HR', AttritionRate: 8.2 },
  { Department: 'Finance', AttritionRate: 14.1 },
];

// --- Enhanced Sections with 3D ---

const AdvancedAnalyticsSection = () => {
  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Gauge className="w-6 h-6 mr-3 text-indigo-500" />
          Advanced Workforce Analytics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttritionHeatmap data={mockHeatmapData} />
          <SentimentGauge score={75} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RetentionFunnel data={mockFunnelData} />
          <DepartmentRadarAnalysis />
        </div>
      </GlassPanel>
    </div>
  );
};

const PredictiveInsightsSection = () => {
  return (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-indigo-500" />
          Predictive Analytics & Forecasting
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictionTimeline data={mockForecastData} />
          <RiskSatisfactionPlot data={mockRiskData} />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl text-white btn-3d">
            <div className="text-3xl font-black">87%</div>
            <div className="text-sm font-semibold opacity-90">Model Accuracy</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl text-white btn-3d">
            <div className="text-3xl font-black">94%</div>
            <div className="text-sm font-semibold opacity-90">Recall Rate</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl text-white btn-3d">
            <div className="text-3xl font-black">23</div>
            <div className="text-sm font-semibold opacity-90">Key Features</div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

// --- Navigation Tabs Component with 3D Effects ---
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Advanced Analytics', icon: Gauge },
    { id: 'predictions', label: 'Predictive Insights', icon: TrendingUp },
  ];

  return (
    <nav className="mb-8">
      <div className="flex space-x-1 bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-2xl border border-white/40 glass-3d">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 capitalize btn-3d ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- Main Application Component with 3D Background ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const parallaxOffset = useParallax(0.1);
  
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
          <div className="space-y-6">
            <Loader loading={trendLoading} error={trendError}>
              {<TrendVisualization data={trendData} />}
            </Loader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Loader loading={deptLoading} error={deptError}>
                {<DepartmentAnalysis data={deptData || mockDepartmentData} />}
              </Loader>

              <div className="lg:col-span-2">
                <GlassPanel className="p-6 h-full">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-indigo-500" />
                    Quick Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2">Top Performing</h4>
                      <p className="text-2xl font-black text-green-600">HR Department</p>
                      <p className="text-sm text-green-700 mt-2">Lowest attrition rate at 8.2%</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-2xl border border-red-200">
                      <h4 className="font-bold text-red-800 mb-2">Needs Attention</h4>
                      <p className="text-2xl font-black text-red-600">Sales Department</p>
                      <p className="text-sm text-red-700 mt-2">Highest attrition rate at 25.3%</p>
                    </div>
                  </div>
                </GlassPanel>
              </div>
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
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans p-4 md:p-8 relative overflow-hidden"
      style={{
        backgroundPosition: `${50 + parallaxOffset.x * 50}% ${50 + parallaxOffset.y * 50}%`
      }}
    >
      {/* 3D Background with reduced opacity */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <ThreeScene />
      </div>
      
      <header className="mb-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-3d mb-4">
              HR ANALYTICS 3D
            </h1>
            <p className="text-xl text-gray-600 font-medium">Next-generation workforce intelligence with immersive 3D visualizations</p>
          </div>
          
          <div className="mt-6 lg:mt-0 flex items-center justify-center lg:justify-end space-x-4">
            <button 
              onClick={handleRefreshAll} 
              disabled={allLoading}
              className={`flex items-center px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 btn-3d shadow-2xl ${
                allLoading 
                  ? 'bg-indigo-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              <RefreshCcw className={`w-6 h-6 mr-3 ${allLoading ? 'animate-spin' : ''}`} />
              {allLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-base font-semibold">
          <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700">Live Data Stream</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full pulse-3d"></div>
            <span className="text-gray-700">AI Powered Predictions</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700">Real-time Analytics</span>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-indigo-500 rounded-full pulse-3d"></div>
            <span className="text-gray-700">3D Immersive Experience</span>
          </div>
        </div>
      </header>

      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10">
        {renderTabContent()}
      </main>

      <footer className="mt-12 text-center relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white/40 shadow-2xl glass-3d">
          <p className="text-gray-700 font-bold text-lg">HR Analytics Intelligence Platform</p>
          <p className="text-gray-600 text-base mt-2 font-medium">Powered by Machine Learning • Real-time Insights • Strategic Workforce Planning</p>
          <div className="mt-4 flex justify-center space-x-8 text-sm font-semibold text-gray-500">
            <span>🔒 Enterprise Secure</span>
            <span>⚡ Real-time Processing</span>
            <span>🤖 AI-Powered Analytics</span>
            <span>🎯 3D Immersive Dashboards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}