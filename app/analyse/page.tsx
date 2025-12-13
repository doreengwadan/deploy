"use client"

import { useState } from 'react'
import Header from '../../componets/Header'

// Analytics Page Component
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Analytics data
  const [analyticsData] = useState({
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
  const [playsData] = useState([
    { day: 'Mon', plays: 45000 },
    { day: 'Tue', plays: 52000 },
    { day: 'Wed', plays: 48000 },
    { day: 'Thu', plays: 61000 },
    { day: 'Fri', plays: 75000 },
    { day: 'Sat', plays: 82000 },
    { day: 'Sun', plays: 68000 },
  ])

  const [revenueData] = useState([
    { day: 'Mon', revenue: 450 },
    { day: 'Tue', revenue: 520 },
    { day: 'Wed', revenue: 480 },
    { day: 'Thu', revenue: 610 },
    { day: 'Fri', revenue: 750 },
    { day: 'Sat', revenue: 820 },
    { day: 'Sun', revenue: 680 },
  ])

  const [userGrowthData] = useState([
    { month: 'Jan', users: 8500 },
    { month: 'Feb', users: 9200 },
    { month: 'Mar', users: 9800 },
    { month: 'Apr', users: 10500 },
    { month: 'May', users: 11200 },
    { month: 'Jun', users: 12543 },
  ])

  // Top content
  const [topSongs] = useState([
    { id: 1, title: 'Midnight Dreams', artist: 'Ava Luna', plays: 12543, change: '+12%' },
    { id: 2, title: 'Neon Lights', artist: 'The Synthetics', plays: 8921, change: '+8%' },
    { id: 3, title: 'Ocean Waves', artist: 'Coastal Breeze', plays: 6543, change: '+15%' },
    { id: 4, title: 'Digital Love', artist: 'Cyber Pulse', plays: 4321, change: '+5%' },
    { id: 5, title: 'City Lights', artist: 'Urban Flow', plays: 3210, change: '-2%' },
  ])

  const [topArtists] = useState([
    { id: 1, name: 'Ava Luna', plays: 25643, songs: 12, change: '+18%' },
    { id: 2, name: 'The Synthetics', plays: 18921, songs: 8, change: '+12%' },
    { id: 3, name: 'Coastal Breeze', plays: 16543, songs: 6, change: '+22%' },
    { id: 4, name: 'Cyber Pulse', plays: 14321, songs: 10, change: '+8%' },
    { id: 5, name: 'Urban Flow', plays: 13210, songs: 5, change: '+5%' },
  ])

  const [topGenres] = useState([
    { id: 1, name: 'Electronic', plays: 45643, percentage: 36 },
    { id: 2, name: 'Pop', plays: 28921, percentage: 23 },
    { id: 3, name: 'Synthwave', plays: 18921, percentage: 15 },
    { id: 4, name: 'Ambient', plays: 16543, percentage: 13 },
    { id: 5, name: 'Rock', plays: 15421, percentage: 12 },
  ])

  // Geographical data
  const [geoData] = useState([
    { country: 'United States', users: 4521, percentage: 36 },
    { country: 'United Kingdom', users: 2310, percentage: 18 },
    { country: 'Germany', users: 1892, percentage: 15 },
    { country: 'Canada', users: 1254, percentage: 10 },
    { country: 'Australia', users: 987, percentage: 8 },
    { country: 'Others', users: 1569, percentage: 13 },
  ])

  // Device data
  const [deviceData] = useState([
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