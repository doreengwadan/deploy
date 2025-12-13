"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../componets/Header'

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinDate: string;
  stats: {
    songsPlayed: number;
    songsLiked: number;
    playlistsCreated: number;
    hoursListened: number;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'playlists'>('overview')

  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true)
      try {
        const userData = localStorage.getItem('khedman_user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          const userWithStats: User = {
            ...parsedUser,
            bio: parsedUser.bio || "Music lover and audio enthusiast. Always searching for new beats!",
            joinDate: "January 2024",
            stats: {
              songsPlayed: 1245,
              songsLiked: 287,
              playlistsCreated: 15,
              hoursListened: 342
            }
          }
          setUser(userWithStats)
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleEditProfile = () => {
    alert('Edit profile functionality would open here')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-800 rounded w-1/3 mb-8"></div>
              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 px-4">Please log in to view your profile</h1>
          <Link 
            href="/login"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      {/* Profile Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6 md:mb-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors px-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm md:text-base">Back to Home</span>
            </Link>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 md:p-8 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 mb-6 md:mb-0">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-4 border-white/20">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl md:text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">{user.name}</h1>
                  <p className="text-white/70 mb-2 md:mb-4 text-sm md:text-base">{user.email}</p>
                  <p className="text-white/80 max-w-md text-sm md:text-base">{user.bio}</p>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base w-full sm:w-auto mt-4 sm:mt-0"
              >
                Edit Profile
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="bg-white/5 rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-purple-400">{user.stats.songsPlayed.toLocaleString()}</div>
                <div className="text-white/70 text-xs md:text-sm">Songs Played</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-pink-400">{user.stats.songsLiked}</div>
                <div className="text-white/70 text-xs md:text-sm">Songs Liked</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-400">{user.stats.playlistsCreated}</div>
                <div className="text-white/70 text-xs md:text-sm">Playlists</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-green-400">{user.stats.hoursListened}</div>
                <div className="text-white/70 text-xs md:text-sm">Hours Listened</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 md:space-x-4 mb-6 md:mb-8 border-b border-white/10 overflow-x-auto">
            {(['overview', 'activity', 'playlists'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 md:pb-4 px-2 md:px-4 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'activity' ? 'Recent Activity' : 'My Playlists'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Recently Played */}
            <div className="lg:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recently Played</h2>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white/5 hover:bg-white/10 rounded-xl p-3 md:p-4 flex items-center space-x-3 md:space-x-4 transition-colors group">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 md:w-8 md:h-8 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium group-hover:text-purple-400 transition-colors truncate text-sm md:text-base">
                        Song Title {i}
                      </h3>
                      <p className="text-white/60 text-xs md:text-sm truncate">Artist Name</p>
                    </div>
                    <div className="text-white/40 text-xs md:text-sm whitespace-nowrap">2 hours ago</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Top Artists & Quick Stats */}
            <div className="space-y-6 md:space-y-8">
              {/* Top Artists */}
              <div className="bg-white/5 rounded-2xl p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Top Artists</h2>
                <div className="space-y-3 md:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-sm md:text-base">Artist {i}</h3>
                        <p className="text-white/60 text-xs md:text-sm truncate">{i * 15} tracks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white/5 rounded-2xl p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Account Info</h2>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-white/60 text-xs md:text-sm">Member since</p>
                    <p className="font-medium text-sm md:text-base">{user.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs md:text-sm">Account type</p>
                    <p className="font-medium text-green-400 text-sm md:text-base">Premium</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs md:text-sm">Storage used</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-xs md:text-sm">45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}