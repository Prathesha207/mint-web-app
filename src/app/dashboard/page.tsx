// app/dashboard/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Settings, User, Search, Filter, Download,
  Calendar, Clock, Eye, EyeOff, AlertTriangle, CheckCircle,
  X, Plus, Edit2, Trash2, MoreVertical, ChevronRight,
  Play, Pause, RefreshCw, Maximize2, Minimize2, BarChart3,
  LineChart, PieChart, Activity, Server, Cpu, HardDrive,
  Wifi, Shield, Users, Camera, Video, Target, Brain,
  Zap, Database, Globe, Lock, Cloud, Terminal, Sparkles,
  Menu, LogOut, HelpCircle, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'Anomaly detected in Camera #3', time: '2 min ago', read: false },
    { id: 2, type: 'success', message: 'Model training completed', time: '1 hour ago', read: false },
    { id: 3, type: 'info', message: 'New camera connected', time: '3 hours ago', read: true },
  ]);
  const [darkMode, setDarkMode] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(0);

  // Sample data
  const cameras = [
    { id: 1, name: 'Front Entrance', status: 'active', fps: 30, lastActive: 'Just now' },
    { id: 2, name: 'Warehouse A', status: 'active', fps: 25, lastActive: '2 min ago' },
    { id: 3, name: 'Loading Dock', status: 'warning', fps: 18, lastActive: '5 min ago' },
    { id: 4, name: 'Parking Lot', status: 'inactive', fps: 0, lastActive: '1 hour ago' },
  ];

  const models = [
    { id: 1, name: 'Anomaly Detection V2', accuracy: 98.7, status: 'deployed', lastTrained: 'Today' },
    { id: 2, name: 'Person Detector', accuracy: 96.2, status: 'training', lastTrained: '2 hours ago' },
    { id: 3, name: 'Vehicle Classifier', accuracy: 94.5, status: 'ready', lastTrained: 'Yesterday' },
  ];

  const stats = [
    { label: 'Total Cameras', value: '12', change: '+2', trend: 'up', icon: Camera },
    { label: 'Active Models', value: '8', change: '+1', trend: 'up', icon: Brain },
    { label: 'Alerts Today', value: '24', change: '-8', trend: 'down', icon: AlertTriangle },
    { label: 'System Uptime', value: '99.9%', change: '+0.2%', trend: 'up', icon: Activity },
  ];

  const activityLog = [
    { time: '09:30', action: 'Model training started', user: 'System' },
    { time: '09:15', action: 'Camera #3 disconnected', user: 'Auto-detection' },
    { time: '08:45', action: 'New ROI defined', user: 'John Doe' },
    { time: '08:30', action: 'Alert triggered: Unusual activity', user: 'AI Model' },
  ];

  // Simulate live data updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Update camera FPS randomly
  //     setCameras(prev => prev.map(cam => ({
  //       ...cam,
  //       fps: cam.status === 'active' ? Math.floor(Math.random() * 10) + 20 : cam.fps
  //     })));
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} transition-colors`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and breadcrumb */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Vision AI Studio</h1>
                  <div className="flex items-center text-sm opacity-70">
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="capitalize">{activeTab}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Search, notifications, user */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`bg-transparent border-none outline-none pl-8 pr-4 w-48 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>

              {/* Fullscreen */}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {darkMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs opacity-70">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'} transition-all duration-300 h-[calc(100vh-73px)] sticky top-[73px]`}>
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'cameras', label: 'Cameras', icon: Camera },
                { id: 'models', label: 'AI Models', icon: Brain },
                { id: 'training', label: 'Training', icon: Activity },
                { id: 'inference', label: 'Inference', icon: Zap },
                { id: 'analytics', label: 'Analytics', icon: LineChart },
                { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} space-x-3 px-3 py-3 rounded-lg transition-all ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                    : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`absolute bottom-4 ${sidebarCollapsed ? 'left-1/2 transform -translate-x-1/2' : 'right-4'} p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Camera Feed */}
            <div className="lg:col-span-2">
              {/* Live Camera Feed */}
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} mb-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Live Camera Feed</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg bg-blue-600 text-white">
                      <Play className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Pause className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Camera View */}
                <div className="relative bg-black rounded-xl overflow-hidden mb-6">
                  <div className="aspect-video relative">
                    {/* Simulated camera feed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

                    {/* Animated ROIs */}
                    <motion.div
                      animate={{
                        borderColor: ['#3b82f6', '#8b5cf6', '#3b82f6']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-8 left-8 w-32 h-24 border-2 border-blue-500 rounded-lg"
                    >
                      <div className="absolute -top-6 left-0 px-2 py-1 bg-blue-600 rounded text-xs text-white">
                        Entrance
                      </div>
                    </motion.div>

                    {/* Detection indicator */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                      className="absolute bottom-12 right-12 w-12 h-12 border-2 border-red-500 rounded-full"
                    >
                      <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
                    </motion.div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
                      <div className="text-sm">
                        <div className="font-semibold text-white">Camera #1</div>
                        <div className="flex items-center text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                          32 FPS • 24ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Camera Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {cameras.map((camera, index) => (
                    <button
                      key={camera.id}
                      onClick={() => setActiveCamera(index)}
                      className={`relative rounded-xl overflow-hidden aspect-video ${activeCamera === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                      <div className="absolute top-2 left-2">
                        <div className={`w-2 h-2 rounded-full ${camera.status === 'active' ? 'bg-green-500' :
                          camera.status === 'warning' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs font-medium truncate">{camera.name}</div>
                        <div className="text-xs opacity-70">{camera.fps} FPS</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm opacity-70">by {activity.user}</div>
                        </div>
                      </div>
                      <div className="text-sm opacity-70">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Models Status */}
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} mb-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">AI Models</h2>
                  <button className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {models.map((model) => (
                    <div key={model.id} className="p-4 rounded-xl bg-gray-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{model.name}</div>
                        <div className={`px-2 py-1 rounded-lg text-xs ${model.status === 'deployed' ? 'bg-green-500/20 text-green-400' :
                          model.status === 'training' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {model.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="opacity-70">Accuracy: {model.accuracy}%</div>
                        <div className="opacity-70">{model.lastTrained}</div>
                      </div>
                      <div className="mt-3">
                        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} mb-6`}>
                <h2 className="text-xl font-bold mb-6">System Status</h2>
                <div className="space-y-4">
                  {[
                    { label: 'CPU Usage', value: '42%', icon: Cpu, color: 'text-blue-400' },
                    { label: 'Memory', value: '3.2/8GB', icon: HardDrive, color: 'text-green-400' },
                    { label: 'Network', value: '125 Mbps', icon: Wifi, color: 'text-purple-400' },
                    { label: 'GPU', value: '68%', icon: Server, color: 'text-yellow-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'New Model', icon: Brain, color: 'from-blue-600 to-cyan-500' },
                    { label: 'Add Camera', icon: Camera, color: 'from-purple-600 to-pink-500' },
                    { label: 'Run Training', icon: Activity, color: 'from-green-600 to-emerald-500' },
                    { label: 'Export Data', icon: Download, color: 'from-yellow-600 to-orange-500' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${action.color} p-4 flex flex-col items-center justify-center text-white`}
                    >
                      <action.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {false && ( // Set to true to show notifications panel
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Notifications</h3>
                <button className="p-2 rounded-lg hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl ${notification.read ? 'bg-gray-800/30' : 'bg-blue-500/10'} border border-gray-700/50`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${notification.type === 'alert' ? 'bg-red-500/20' :
                        notification.type === 'success' ? 'bg-green-500/20' :
                          'bg-blue-500/20'
                        }`}>
                        {notification.type === 'alert' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                          notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                            <Bell className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{notification.message}</div>
                        <div className="text-sm opacity-70 mt-1">{notification.time}</div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      <button className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

// Add missing icon
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

