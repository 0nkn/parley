import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaCalendarAlt, 
  FaLanguage, 
  FaComments, 
  FaBookOpen, 
  FaWalking 
} from 'react-icons/fa';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { IconType } from 'react-icons';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Wrapper components for icons to prevent TypeScript errors
const ChartLineIcon = () => <span className="mr-2"><FaChartLine /></span>;
const CalendarIcon = () => <span className="mr-2 text-indigo-400"><FaCalendarAlt /></span>;
const ChartLineIconPurple = () => <span className="mr-2 text-purple-400"><FaChartLine /></span>;
const CommentsIcon = () => <span className="mr-2 text-pink-400"><FaComments /></span>;
const BookOpenIcon = () => <span><FaBookOpen /></span>;
const LanguageIcon = () => <span><FaLanguage /></span>;
const WalkingIcon = () => <span><FaWalking /></span>;

interface DashboardData {
  totalConversations: number;
  totalMessages: number;
  termsLearned: number;
  phrasesUsed: number;
  languagesUsed: number;
  averageResponseTime: number;
  dailyActivity: {
    date: string;
    messages: number;
  }[];
  featureUsage: {
    feature: string;
    count: number;
  }[];
  messageTypes: {
    type: string;
    count: number;
  }[];
}

export default function ImpactDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data (simulated)
  useEffect(() => {
    // This would fetch from an API in a real application
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const data: DashboardData = generateMockData(timeframe);
      setDashboardData(data);
      setIsLoading(false);
    }, 1000);
  }, [timeframe]);

  // Generate mock data based on timeframe
  const generateMockData = (timeframe: 'week' | 'month' | 'year'): DashboardData => {
    const dailyActivity = [];
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        messages: Math.floor(Math.random() * 20) + 5
      });
    }
    
    const totalMessages = dailyActivity.reduce((sum, day) => sum + day.messages, 0);
    
    return {
      totalConversations: Math.floor(totalMessages / 8),
      totalMessages,
      termsLearned: Math.floor(Math.random() * 100) + 20,
      phrasesUsed: Math.floor(Math.random() * 150) + 30,
      languagesUsed: Math.floor(Math.random() * 4) + 1,
      averageResponseTime: Math.floor(Math.random() * 10) + 5,
      dailyActivity,
      featureUsage: [
        { feature: 'Chat', count: Math.floor(Math.random() * 100) + 100 },
        { feature: 'Communication Board', count: Math.floor(Math.random() * 80) + 40 },
        { feature: 'Medical Terminology', count: Math.floor(Math.random() * 60) + 20 },
        { feature: 'Translation', count: Math.floor(Math.random() * 70) + 30 },
        { feature: 'Phrasebook', count: Math.floor(Math.random() * 50) + 10 }
      ],
      messageTypes: [
        { type: 'Text', count: Math.floor(Math.random() * 70) + 100 },
        { type: 'Voice', count: Math.floor(Math.random() * 50) + 30 },
        { type: 'Visual Board', count: Math.floor(Math.random() * 40) + 20 }
      ]
    };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-lg text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text flex items-center">
          <ChartLineIcon />
          Communication Impact Dashboard
        </h2>
        
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeframe === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : dashboardData ? (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Conversations</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.totalConversations}</p>
                </div>
                <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
                  <CommentsIcon />
                </div>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Messages</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.totalMessages}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                  <CommentsIcon />
                </div>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Terms Learned</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.termsLearned}</p>
                </div>
                <div className="p-3 bg-pink-500/20 rounded-full text-pink-400">
                  <BookOpenIcon />
                </div>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Phrases Used</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.phrasesUsed}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                  <BookOpenIcon />
                </div>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Languages Used</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.languagesUsed}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                  <LanguageIcon />
                </div>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg. Response Time</p>
                  <p className="text-2xl font-bold gradient-text">{dashboardData.averageResponseTime}s</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
                  <WalkingIcon />
                </div>
              </div>
            </div>
          </div>
          
          {/* Simple tables instead of charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glassmorphic p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarIcon />
                Daily Activity
              </h3>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-2">Date</th>
                      <th scope="col" className="px-4 py-2">Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.dailyActivity.slice(-10).map((day, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2">{day.date}</td>
                        <td className="px-4 py-2">{day.messages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="glassmorphic p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ChartLineIconPurple />
                Feature Usage
              </h3>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-2">Feature</th>
                      <th scope="col" className="px-4 py-2">Usage Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.featureUsage.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2">{item.feature}</td>
                        <td className="px-4 py-2">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="glassmorphic p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CommentsIcon />
              Message Types
            </h3>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-2">Type</th>
                    <th scope="col" className="px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.messageTypes.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>Data shown is from {timeframe === 'week' ? 'the last 7 days' : timeframe === 'month' ? 'the last 30 days' : 'the last year'}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No data available. Start using Parley to see your impact.</p>
        </div>
      )}
    </div>
  );
} 