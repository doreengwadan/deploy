"use client"

import { useState, useEffect } from 'react'
import Header from '../../componets/Header'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // Statistics state
  const [stats, setStats] = useState({
    totalUsers: 12543,
    totalSongs: 8921,
    totalPlays: 1254300,
    totalUploads: 324,
    activeUsers: 2431,
    revenue: 12543.50
  })

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'John Doe', action: 'uploaded a new song', time: '2 min ago', type: 'upload' },
    { id: 2, user: 'Sarah Smith', action: 'reported inappropriate content', time: '15 min ago', type: 'report' },
    { id: 3, user: 'Mike Johnson', action: 'subscribed to premium', time: '1 hour ago', type: 'subscription' },
    { id: 4, user: 'Emma Wilson', action: 'created a playlist', time: '2 hours ago', type: 'playlist' },
    { id: 5, user: 'Alex Brown', action: 'uploaded a new song', time: '3 hours ago', type: 'upload' },
  ])

  // Reported content
  const [reportedContent, setReportedContent] = useState([
    { id: 1, song: 'Midnight Dreams', artist: 'Ava Luna', reporter: 'User123', reason: 'Copyright', status: 'pending' },
    { id: 2, song: 'Neon Lights', artist: 'The Synthetics', reporter: 'User456', reason: 'Explicit Content', status: 'reviewed' },
    { id: 3, song: 'Ocean Waves', artist: 'Coastal Breeze', reporter: 'User789', reason: 'Hate Speech', status: 'pending' },
  ])

  // User management
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'premium', status: 'active', joined: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'artist', status: 'suspended', joined: '2024-01-05' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'user', status: 'active', joined: '2024-01-01' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', role: 'admin', status: 'active', joined: '2023-12-28' },
  ])

  // Song management
  const [songs, setSongs] = useState([
    { id: 1, title: 'Midnight Dreams', artist: 'Ava Luna', genre: 'Electronic', plays: 12543, status: 'published' },
    { id: 2, title: 'Neon Lights', artist: 'The Synthetics', genre: 'Synthwave', plays: 8921, status: 'published' },
    { id: 3, title: 'Ocean Waves', artist: 'Coastal Breeze', genre: 'Ambient', plays: 6543, status: 'pending' },
    { id: 4, title: 'Digital Love', artist: 'Cyber Pulse', genre: 'Electronic', plays: 4321, status: 'published' },
    { id: 5, title: 'City Lights', artist: 'Urban Flow', genre: 'Pop', plays: 3210, status: 'rejected' },
  ])

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle user actions
  const handleUserAction = (userId: number, action: string) => {
    if (action === 'suspend') {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'suspended' } : user
      ))
    } else if (action === 'activate') {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'active' } : user
      ))
    } else if (action === 'delete') {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  // Handle song actions
  const handleSongAction = (songId: number, action: string) => {
    if (action === 'approve') {
      setSongs(songs.map(song => 
        song.id === songId ? { ...song, status: 'published' } : song
      ))
    } else if (action === 'reject') {
      setSongs(songs.map(song => 
        song.id === songId ? { ...song, status: 'rejected' } : song
      ))
    } else if (action === 'delete') {
      setSongs(songs.filter(song => song.id !== songId))
    }
  }

  // Handle report actions
  const handleReportAction = (reportId: number, action: string) => {
    if (action === 'review') {
      setReportedContent(reportedContent.map(report => 
        report.id === reportId ? { ...report, status: 'reviewed' } : report
      ))
    } else if (action === 'delete') {
      setReportedContent(reportedContent.filter(report => report.id !== reportId))
    }
  }

  // Statistics cards
  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', change: '+12%', color: 'blue' },
    { title: 'Total Songs', value: stats.totalSongs, icon: '🎵', change: '+8%', color: 'purple' },
    { title: 'Total Plays', value: stats.totalPlays.toLocaleString(), icon: '▶️', change: '+23%', color: 'green' },
    { title: 'Today\'s Uploads', value: stats.totalUploads, icon: '⬆️', change: '+5%', color: 'orange' },
    { title: 'Active Users', value: stats.activeUsers, icon: '👤', change: '+15%', color: 'pink' },
    { title: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', change: '+18%', color: 'yellow' },
  ]

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
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>

            {/* Notifications */}
            <button className="p-2 relative">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Current Time - Mobile */}
          <p className="text-xs text-gray-400 mt-2 text-center">{currentTime}</p>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-40">
        <div className="flex-1 flex flex-col p-4">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Kheman Music</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'songs', label: 'Song Management', icon: '🎵' },
              { id: 'reports', label: 'Reports', icon: '🚨' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin Info */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg">👑</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-gray-400">admin@kheman.com</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="md:hidden fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-50 animate-slideIn">
            <div className="flex flex-col h-full p-4">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1 flex-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'users', label: 'User Management', icon: '👥' },
                  { id: 'songs', label: 'Song Management', icon: '🎵' },
                  { id: 'reports', label: 'Reports', icon: '🚨' },
                  { id: 'analytics', label: 'Analytics', icon: '📈' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm ${
                      activeTab === item.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Admin Info */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">👑</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Super Admin</p>
                    <p className="text-xs text-gray-400">admin@kheman.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`md:ml-64 pt-16 md:pt-0 pb-20 md:pb-6`}>
        <div className="p-4 md:p-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">{currentTime}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm w-64"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Notifications */}
              <button className="p-2 relative">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Admin Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm">👑</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Super Admin</p>
                  <p className="text-gray-400 text-xs">admin@kheman.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Mobile */}
          <div className="md:hidden mb-4 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {['dashboard', 'users', 'songs', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {statCards.map((stat, index) => (
                  <div key={index} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <p className="text-green-500 text-xs mt-1">{stat.change} from last month</p>
                      </div>
                      <div className="text-3xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <button className="text-purple-400 text-sm">View All</button>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-2 hover:bg-gray-800 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          activity.type === 'upload' ? 'bg-blue-500/20' :
                          activity.type === 'report' ? 'bg-red-500/20' :
                          activity.type === 'subscription' ? 'bg-green-500/20' :
                          'bg-purple-500/20'
                        }`}>
                          {activity.type === 'upload' && '⬆️'}
                          {activity.type === 'report' && '🚨'}
                          {activity.type === 'subscription' && '💰'}
                          {activity.type === 'playlist' && '📋'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Usage</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bandwidth Usage</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Active Sessions</span>
                        <span>243</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm">
                    Add User
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm">👤</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'artist' ? 'bg-blue-500/20 text-blue-400' :
                            user.role === 'premium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{user.joined}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                              className={`px-3 py-1 rounded text-xs ${
                                user.status === 'active'
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                              }`}
                            >
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Song Management */}
          {activeTab === 'songs' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Song Management</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search songs..."
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm w-48"
                    />
                    <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm">
                      <option>All Genres</option>
                      <option>Electronic</option>
                      <option>Pop</option>
                      <option>Rock</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Song</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Artist</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Genre</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Plays</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song) => (
                      <tr key={song.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-xs font-bold">S</span>
                            </div>
                            <p className="text-sm font-medium">{song.title}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{song.artist}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">
                            {song.genre}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{song.plays.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            song.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            song.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {song.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {song.status === 'pending' && (
                              <button
                                onClick={() => handleSongAction(song.id, 'approve')}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs"
                              >
                                Approve
                              </button>
                            )}
                            {song.status === 'pending' && (
                              <button
                                onClick={() => handleSongAction(song.id, 'reject')}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleSongAction(song.id, 'delete')}
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Management */}
          {activeTab === 'reports' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold">Reported Content</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Song</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Artist</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Reporter</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Reason</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedContent.map((report) => (
                      <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <p className="text-sm font-medium">{report.song}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{report.artist}</td>
                        <td className="p-4 text-sm text-gray-400">{report.reporter}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.reason === 'Copyright' ? 'bg-red-500/20 text-red-400' :
                            report.reason === 'Explicit Content' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {report.reason}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {report.status === 'pending' && (
                              <button
                                onClick={() => handleReportAction(report.id, 'review')}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs"
                              >
                                Review
                              </button>
                            )}
                            <button
                              onClick={() => handleReportAction(report.id, 'delete')}
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'users' ? 'text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('users')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.023-.562.045-.843.067a23.146 23.146 0 01-10.314 0c-.281-.022-.562-.044-.843-.067m0 0A11.145 11.145 0 0112 10.5c-2.09 0-4.074.566-5.78 1.5m5.78 5.5h6" />
            </svg>
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'songs' ? 'text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('songs')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs mt-1">Songs</span>
          </button>
          
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'reports' ? 'text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('reports')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs mt-1">Reports</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-gray-400"
            onClick={() => setActiveTab('settings')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}