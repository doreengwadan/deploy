"use client"

import { useState, useEffect, useRef } from 'react'
import Header from '../../componets/Header'
import { useRouter } from 'next/navigation'

// Analytics Page Component
export default function AnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('plays')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalPlays: 1254300,
    totalRevenue: 12543.50,
    totalUsers: 12543,
    totalSongs: 8921,
    avgPlayTime: '3:45',
    peakHours: '18:00-21:00',
    retentionRate: '68%',
    conversionRate: '12%'
  })

  // Chart data
  const [playsData, setPlaysData] = useState([
    { day: 'Mon', plays: 45000 },
    { day: 'Tue', plays: 52000 },
    { day: 'Wed', plays: 48000 },
    { day: 'Thu', plays: 61000 },
    { day: 'Fri', plays: 75000 },
    { day: 'Sat', plays: 82000 },
    { day: 'Sun', plays: 68000 },
  ])

  const [revenueData, setRevenueData] = useState([
    { day: 'Mon', revenue: 450 },
    { day: 'Tue', revenue: 520 },
    { day: 'Wed', revenue: 480 },
    { day: 'Thu', revenue: 610 },
    { day: 'Fri', revenue: 750 },
    { day: 'Sat', revenue: 820 },
    { day: 'Sun', revenue: 680 },
  ])

  const [userGrowthData, setUserGrowthData] = useState([
    { month: 'Jan', users: 8500 },
    { month: 'Feb', users: 9200 },
    { month: 'Mar', users: 9800 },
    { month: 'Apr', users: 10500 },
    { month: 'May', users: 11200 },
    { month: 'Jun', users: 12543 },
  ])

  // Top content
  const [topSongs, setTopSongs] = useState([
    { id: 1, title: 'Midnight Dreams', artist: 'Ava Luna', plays: 12543, change: '+12%' },
    { id: 2, title: 'Neon Lights', artist: 'The Synthetics', plays: 8921, change: '+8%' },
    { id: 3, title: 'Ocean Waves', artist: 'Coastal Breeze', plays: 6543, change: '+15%' },
    { id: 4, title: 'Digital Love', artist: 'Cyber Pulse', plays: 4321, change: '+5%' },
    { id: 5, title: 'City Lights', artist: 'Urban Flow', plays: 3210, change: '-2%' },
  ])

  const [topArtists, setTopArtists] = useState([
    { id: 1, name: 'Ava Luna', plays: 25643, songs: 12, change: '+18%' },
    { id: 2, name: 'The Synthetics', plays: 18921, songs: 8, change: '+12%' },
    { id: 3, name: 'Coastal Breeze', plays: 16543, songs: 6, change: '+22%' },
    { id: 4, name: 'Cyber Pulse', plays: 14321, songs: 10, change: '+8%' },
    { id: 5, name: 'Urban Flow', plays: 13210, songs: 5, change: '+5%' },
  ])

  const [topGenres, setTopGenres] = useState([
    { id: 1, name: 'Electronic', plays: 45643, percentage: 36 },
    { id: 2, name: 'Pop', plays: 28921, percentage: 23 },
    { id: 3, name: 'Synthwave', plays: 18921, percentage: 15 },
    { id: 4, name: 'Ambient', plays: 16543, percentage: 13 },
    { id: 5, name: 'Rock', plays: 15421, percentage: 12 },
  ])

  // Geographical data
  const [geoData, setGeoData] = useState([
    { country: 'United States', users: 4521, percentage: 36 },
    { country: 'United Kingdom', users: 2310, percentage: 18 },
    { country: 'Germany', users: 1892, percentage: 15 },
    { country: 'Canada', users: 1254, percentage: 10 },
    { country: 'Australia', users: 987, percentage: 8 },
    { country: 'Others', users: 1569, percentage: 13 },
  ])

  // Device data
  const [deviceData, setDeviceData] = useState([
    { device: 'Mobile', percentage: 65 },
    { device: 'Desktop', percentage: 25 },
    { device: 'Tablet', percentage: 8 },
    { device: 'Others', percentage: 2 },
  ])

  // Time range options
  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ]

  // Metric options
  const metrics = [
    { value: 'plays', label: 'Plays', icon: '▶️' },
    { value: 'revenue', label: 'Revenue', icon: '💰' },
    { value: 'users', label: 'Users', icon: '👥' },
    { value: 'songs', label: 'Songs', icon: '🎵' },
  ]

  // Calculate max value for charts
  const maxPlays = Math.max(...playsData.map(d => d.plays))
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
  const maxUsers = Math.max(...userGrowthData.map(d => d.users))

  // Export data function
  const exportData = (type: string) => {
    alert(`Exporting ${type} data...`)
    // In a real app, this would generate and download a CSV/Excel file
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile App Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Toggle */}
            <button 
              className="p-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold">Analytics</h1>

            {/* Export Button */}
            <button 
              className="p-2"
              onClick={() => exportData('analytics')}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Main Content */}
      <main className={`pt-16 md:pt-6 pb-20 md:pb-6`}>
        <div className="p-4 md:p-6">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track performance, user behavior, and platform growth</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {/* Time Range Selector */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeRange === range.value
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportData('analytics')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Plays', value: analyticsData.totalPlays.toLocaleString(), icon: '▶️', change: '+12%' },
              { label: 'Total Revenue', value: `$${analyticsData.totalRevenue.toLocaleString()}`, icon: '💰', change: '+18%' },
              { label: 'Total Users', value: analyticsData.totalUsers.toLocaleString(), icon: '👥', change: '+8%' },
              { label: 'Avg Play Time', value: analyticsData.avgPlayTime, icon: '⏱️', change: '+5%' },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-green-500 text-xs mt-1">{stat.change} from last period</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Plays Chart */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Plays Over Time</h3>
                <div className="text-sm text-gray-400">Last 7 days</div>
              </div>
              <div className="h-48 flex items-end space-x-2 pt-4">
                {playsData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.plays / maxPlays) * 100}%` }}
                    />
                    <div className="text-xs text-gray-400 mt-2">{item.day}</div>
                    <div className="text-xs font-medium mt-1">{item.plays.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Revenue Over Time</h3>
                <div className="text-sm text-gray-400">Last 7 days</div>
              </div>
              <div className="h-48 flex items-end space-x-2 pt-4">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    />
                    <div className="text-xs text-gray-400 mt-2">{item.day}</div>
                    <div className="text-xs font-medium mt-1">${item.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Growth</h3>
              <div className="text-sm text-green-500">+23% growth this quarter</div>
            </div>
            <div className="h-48 flex items-end space-x-4 pt-4 px-4">
              {userGrowthData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-12 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(item.users / maxUsers) * 100}%` }}
                  />
                  <div className="text-xs text-gray-400 mt-2">{item.month}</div>
                  <div className="text-xs font-medium mt-1">{item.users.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Top Songs */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Songs</h3>
                <button 
                  onClick={() => exportData('top-songs')}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Export
                </button>
              </div>
              <div className="space-y-3">
                {topSongs.map((song) => (
                  <div key={song.id} className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xs font-bold">{song.id}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{song.plays.toLocaleString()}</p>
                      <p className={`text-xs ${song.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {song.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Artists</h3>
                <button 
                  onClick={() => exportData('top-artists')}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Export
                </button>
              </div>
              <div className="space-y-3">
                {topArtists.map((artist) => (
                  <div key={artist.id} className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm">👨‍🎤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{artist.name}</p>
                      <p className="text-xs text-gray-400">{artist.songs} songs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{artist.plays.toLocaleString()}</p>
                      <p className="text-xs text-green-500">{artist.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Genres */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Genres</h3>
                <button 
                  onClick={() => exportData('top-genres')}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Export
                </button>
              </div>
              <div className="space-y-4">
                {topGenres.map((genre) => (
                  <div key={genre.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{genre.name}</span>
                      <span>{genre.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${genre.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographical & Device Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographical Distribution */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Geographical Distribution</h3>
              <div className="space-y-3">
                {geoData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-32 text-sm text-gray-400">{item.country}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm font-medium">{item.users.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Usage */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-48 h-48">
                  {/* Pie chart visualization */}
                  {deviceData.map((item, index, array) => {
                    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#6B7280']
                    const total = array.reduce((sum, d) => sum + d.percentage, 0)
                    let currentAngle = 0
                    
                    for (let i = 0; i < index; i++) {
                      currentAngle += (array[i].percentage / total) * 360
                    }
                    
                    const angle = (item.percentage / total) * 360
                    const radius = 80
                    
                    return (
                      <div key={index} className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="absolute w-48 h-48 rounded-full"
                          style={{
                            background: `conic-gradient(${colors[index]} 0deg ${angle}deg, transparent ${angle}deg 360deg)`,
                            transform: `rotate(${currentAngle}deg)`,
                          }}
                        />
                      </div>
                    )
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {deviceData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: index === 0 ? '#8B5CF6' : 
                                       index === 1 ? '#3B82F6' : 
                                       index === 2 ? '#10B981' : '#6B7280'
                      }}
                    ></div>
                    <span className="text-sm text-gray-400">{item.device}</span>
                    <span className="ml-auto text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.023-.562.045-.843.067a23.146 23.146 0 01-10.314 0c-.281-.022-.562-.044-.843-.067m0 0A11.145 11.145 0 0112 10.5c-2.09 0-4.074.566-5.78 1.5m5.78 5.5h6" />
            </svg>
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs mt-1">Analytics</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs mt-1">Reports</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Settings Page Component
export function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('general')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Kheman Music',
    siteUrl: 'https://khemanmusic.com',
    siteDescription: 'Discover millions of songs',
    siteEmail: 'support@khemanmusic.com',
    maintenanceMode: false,
    registrationOpen: true,
    uploadsEnabled: true,
  })

  // Content Settings
  const [contentSettings, setContentSettings] = useState({
    maxFileSize: 50, // MB
    allowedFormats: ['mp3', 'wav', 'flac'],
    autoApproveUploads: false,
    contentModeration: true,
    explicitContent: true,
    maxPlaylistSize: 100,
  })

  // User Settings
  const [userSettings, setUserSettings] = useState({
    emailVerification: true,
    allowSocialLogin: true,
    maxUploadsPerDay: 5,
    allowProfileCustomization: true,
    allowComments: true,
    allowRatings: true,
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'USD',
    subscriptionPrice: 9.99,
    enableAds: true,
    revenueShare: 70, // Percentage for artists
    payoutThreshold: 50,
    stripeEnabled: true,
    paypalEnabled: true,
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.khemanmusic.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@khemanmusic.com',
    fromName: 'Kheman Music',
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    ipWhitelist: '',
    enableHttps: true,
    backupFrequency: 'daily',
  })

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    apiEnabled: true,
    apiRateLimit: 100,
    enableWebhooks: true,
    webhookUrl: '',
    enableAnalytics: true,
    googleAnalyticsId: '',
  })

  // Handle setting changes
  const handleGeneralChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleContentChange = (key: string, value: any) => {
    setContentSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleUserChange = (key: string, value: any) => {
    setUserSettings(prev => ({ ...prev, [key]: value }))
  }

  const handlePaymentChange = (key: string, value: any) => {
    setPaymentSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleEmailChange = (key: string, value: any) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleApiChange = (key: string, value: any) => {
    setApiSettings(prev => ({ ...prev, [key]: value }))
  }

  // Save settings
  const saveSettings = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!')
  }

  // Reset settings
  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset all settings to default
      alert('Settings reset to default!')
    }
  }

  // Export settings
  const exportSettings = () => {
    const settings = {
      general: generalSettings,
      content: contentSettings,
      user: userSettings,
      payment: paymentSettings,
      email: emailSettings,
      security: securitySettings,
      api: apiSettings,
    }
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'kheman-settings-backup.json'
    link.click()
  }

  // Import settings
  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        // Validate and set imported settings
        alert('Settings imported successfully!')
      } catch (error) {
        alert('Invalid settings file!')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile App Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Toggle */}
            <button 
              className="p-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold">Settings</h1>

            {/* Save Button */}
            <button 
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-sm"
              onClick={saveSettings}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Main Content */}
      <main className={`pt-16 md:pt-6 pb-20 md:pb-6`}>
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Configure platform settings and preferences</p>
          </div>

          {/* Settings Navigation */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Side Navigation */}
            <div className="lg:w-64">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <nav className="space-y-1">
                  {[
                    { id: 'general', label: 'General', icon: '⚙️' },
                    { id: 'content', label: 'Content', icon: '🎵' },
                    { id: 'users', label: 'Users', icon: '👥' },
                    { id: 'payments', label: 'Payments', icon: '💰' },
                    { id: 'email', label: 'Email', icon: '📧' },
                    { id: 'security', label: 'Security', icon: '🔒' },
                    { id: 'api', label: 'API', icon: '🔌' },
                    { id: 'advanced', label: 'Advanced', icon: '⚡' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                        activeSection === item.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-800 space-y-2">
                  <button
                    onClick={saveSettings}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={exportSettings}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                  >
                    Export Settings
                  </button>
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                    <div className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-center cursor-pointer">
                      Import Settings
                    </div>
                  </label>
                  <button
                    onClick={resetSettings}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Name</label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Site URL</label>
                      <input
                        type="url"
                        value={generalSettings.siteUrl}
                        onChange={(e) => handleGeneralChange('siteUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Description</label>
                      <textarea
                        value={generalSettings.siteDescription}
                        onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={generalSettings.siteEmail}
                          onChange={(e) => handleGeneralChange('siteEmail', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) => handleGeneralChange('maintenanceMode', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Maintenance Mode</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={generalSettings.registrationOpen}
                          onChange={(e) => handleGeneralChange('registrationOpen', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow New Registrations</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={generalSettings.uploadsEnabled}
                          onChange={(e) => handleGeneralChange('uploadsEnabled', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Song Uploads</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Settings */}
              {activeSection === 'content' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">Content Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                      <input
                        type="number"
                        value={contentSettings.maxFileSize}
                        onChange={(e) => handleContentChange('maxFileSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="1"
                        max="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Allowed Audio Formats</label>
                      <div className="flex flex-wrap gap-2">
                        {['mp3', 'wav', 'flac', 'aac', 'ogg'].map((format) => (
                          <label key={format} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={contentSettings.allowedFormats.includes(format)}
                              onChange={(e) => {
                                const newFormats = e.target.checked
                                  ? [...contentSettings.allowedFormats, format]
                                  : contentSettings.allowedFormats.filter(f => f !== format)
                                handleContentChange('allowedFormats', newFormats)
                              }}
                              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm">.{format}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Playlist Size</label>
                      <input
                        type="number"
                        value={contentSettings.maxPlaylistSize}
                        onChange={(e) => handleContentChange('maxPlaylistSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="1"
                        max="1000"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contentSettings.autoApproveUploads}
                          onChange={(e) => handleContentChange('autoApproveUploads', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Auto-approve Uploads</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contentSettings.contentModeration}
                          onChange={(e) => handleContentChange('contentModeration', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Content Moderation</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contentSettings.explicitContent}
                          onChange={(e) => handleContentChange('explicitContent', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow Explicit Content</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* User Settings */}
              {activeSection === 'users' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">User Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Uploads Per Day</label>
                      <input
                        type="number"
                        value={userSettings.maxUploadsPerDay}
                        onChange={(e) => handleUserChange('maxUploadsPerDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userSettings.emailVerification}
                          onChange={(e) => handleUserChange('emailVerification', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Require Email Verification</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userSettings.allowSocialLogin}
                          onChange={(e) => handleUserChange('allowSocialLogin', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow Social Login</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userSettings.allowProfileCustomization}
                          onChange={(e) => handleUserChange('allowProfileCustomization', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow Profile Customization</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userSettings.allowComments}
                          onChange={(e) => handleUserChange('allowComments', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow Comments</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userSettings.allowRatings}
                          onChange={(e) => handleUserChange('allowRatings', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Allow Ratings</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeSection === 'payments' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select
                          value={paymentSettings.currency}
                          onChange={(e) => handlePaymentChange('currency', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subscription Price</label>
                        <input
                          type="number"
                          value={paymentSettings.subscriptionPrice}
                          onChange={(e) => handlePaymentChange('subscriptionPrice', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Artist Revenue Share (%)</label>
                      <input
                        type="range"
                        value={paymentSettings.revenueShare}
                        onChange={(e) => handlePaymentChange('revenueShare', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        min="0"
                        max="100"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>0%</span>
                        <span>{paymentSettings.revenueShare}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Payout Threshold ($)</label>
                      <input
                        type="number"
                        value={paymentSettings.payoutThreshold}
                        onChange={(e) => handlePaymentChange('payoutThreshold', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="1"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.enableAds}
                          onChange={(e) => handlePaymentChange('enableAds', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Advertising</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.stripeEnabled}
                          onChange={(e) => handlePaymentChange('stripeEnabled', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Stripe Payments</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentSettings.paypalEnabled}
                          onChange={(e) => handlePaymentChange('paypalEnabled', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable PayPal Payments</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout (hours)</label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="1">1 hour</option>
                        <option value="4">4 hours</option>
                        <option value="8">8 hours</option>
                        <option value="24">24 hours</option>
                        <option value="168">1 week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">IP Whitelist (comma-separated)</label>
                      <textarea
                        value={securitySettings.ipWhitelist}
                        onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="192.168.1.1, 10.0.0.1"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Require Two-Factor Authentication for Admins</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableHttps}
                          onChange={(e) => handleSecurityChange('enableHttps', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Force HTTPS</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                      <select
                        value={securitySettings.backupFrequency}
                        onChange={(e) => handleSecurityChange('backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeSection === 'api' && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-xl font-semibold mb-4">API Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
                      <input
                        type="number"
                        value={apiSettings.apiRateLimit}
                        onChange={(e) => handleApiChange('apiRateLimit', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        min="10"
                        max="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Webhook URL</label>
                      <input
                        type="url"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => handleApiChange('webhookUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="https://your-webhook-url.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                      <input
                        type="text"
                        value={apiSettings.googleAnalyticsId}
                        onChange={(e) => handleApiChange('googleAnalyticsId', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="UA-XXXXXXXXX-X"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={apiSettings.apiEnabled}
                          onChange={(e) => handleApiChange('apiEnabled', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable API Access</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={apiSettings.enableWebhooks}
                          onChange={(e) => handleApiChange('enableWebhooks', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Webhooks</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={apiSettings.enableAnalytics}
                          onChange={(e) => handleApiChange('enableAnalytics', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Enable Analytics Tracking</span>
                      </label>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <h3 className="text-sm font-medium mb-2">API Keys</h3>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Production API Key</p>
                            <p className="text-xs text-gray-400">************************</p>
                          </div>
                          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.023-.562.045-.843.067a23.146 23.146 0 01-10.314 0c-.281-.022-.562-.044-.843-.067m0 0A11.145 11.145 0 0112 10.5c-2.09 0-4.074.566-5.78 1.5m5.78 5.5h6" />
            </svg>
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs mt-1">Analytics</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs mt-1">Reports</span>
          </button>
          
          <button className="flex flex-col items-center p-2 text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}