"use client"

import { useState, useEffect } from 'react'
import Header from '../../componets/Header'

interface UserSettings {
  email: string;
  name: string;
  language: string;
  theme: 'dark' | 'light' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    newReleases: boolean;
    playlistUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showListeningActivity: boolean;
    allowMessages: boolean;
  };
  playback: {
    quality: 'low' | 'medium' | 'high' | 'very-high';
    crossfade: number;
    gapless: boolean;
    normalizeVolume: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email: 'user@example.com',
    name: 'John Doe',
    language: 'en',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      newReleases: true,
      playlistUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      showListeningActivity: true,
      allowMessages: true,
    },
    playback: {
      quality: 'high',
      crossfade: 0,
      gapless: true,
      normalizeVolume: true,
    },
  })

  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'playback' | 'billing'>('account')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<UserSettings | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('khedman_user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setSettings(prev => ({
          ...prev,
          email: user.email,
          name: user.name,
        }))
        setOriginalSettings({
          ...settings,
          email: user.email,
          name: user.name,
        })
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }, [])

  const handleSettingChange = (category: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setIsSaving(true)
    
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
      
      if (settings.name || settings.email) {
        const userData = localStorage.getItem('khedman_user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            localStorage.setItem('khedman_user', JSON.stringify({
              ...user,
              name: settings.name,
              email: settings.email,
            }))
          } catch (error) {
            console.error('Error updating user data:', error)
          }
        }
      }
      
      alert('Settings saved successfully!')
    }, 1000)
  }

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings)
      setHasChanges(false)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. This would trigger account deletion process.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Settings</h1>
            <p className="text-white/70 text-sm md:text-base">Manage your account preferences and settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="font-medium capitalize">{activeTab === 'billing' ? 'Subscription & Billing' : activeTab}</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mobile Sidebar Dropdown */}
              {isSidebarOpen && (
                <div className="mt-2 bg-white/5 rounded-xl p-2">
                  <nav className="space-y-1">
                    {(['account', 'notifications', 'privacy', 'playback', 'billing'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab)
                          setIsSidebarOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors capitalize text-sm ${
                          activeTab === tab
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab === 'billing' ? 'Subscription & Billing' : tab}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white/5 rounded-2xl p-4 sticky top-24">
                <nav className="space-y-2">
                  {(['account', 'notifications', 'privacy', 'playback', 'billing'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors capitalize ${
                        activeTab === tab
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab === 'billing' ? 'Subscription & Billing' : tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white/5 rounded-2xl p-4 md:p-6">
                {/* Tab Content */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Account Settings</h2>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Name</label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => handleSettingChange('name', 'name', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm md:text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Email Address</label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleSettingChange('email', 'email', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm md:text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none text-sm md:text-base"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Theme</label>
                        <div className="flex flex-wrap gap-2">
                          {(['dark', 'light', 'auto'] as const).map((theme) => (
                            <button
                              key={theme}
                              onClick={() => handleSettingChange('theme', 'theme', theme)}
                              className={`px-3 py-2 rounded-xl border capitalize text-sm md:text-base ${
                                settings.theme === theme
                                  ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                                  : 'border-white/20 text-white/70 hover:border-white/40'
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Notification Settings</h2>
                    
                    <div className="space-y-4 md:space-y-6">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="font-medium capitalize text-sm md:text-base">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-white/60 text-xs md:text-sm truncate">
                              {key === 'email' && 'Receive email notifications'}
                              {key === 'push' && 'Receive push notifications'}
                              {key === 'newReleases' && 'Get notified about new releases'}
                              {key === 'playlistUpdates' && 'Get notified about playlist updates'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('notifications', key, !value)}
                            className={`w-10 h-6 md:w-12 md:h-6 rounded-full transition-colors relative flex-shrink-0 ${
                              value ? 'bg-purple-500' : 'bg-white/20'
                            }`}
                          >
                            <div className={`absolute top-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-transform ${
                              value ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Profile Visibility</label>
                        <select
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none text-sm md:text-base"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium text-sm md:text-base">Show Listening Activity</div>
                          <div className="text-white/60 text-xs md:text-sm">Allow others to see what you're listening to</div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('privacy', 'showListeningActivity', !settings.privacy.showListeningActivity)}
                          className={`w-10 h-6 md:w-12 md:h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            settings.privacy.showListeningActivity ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-transform ${
                            settings.privacy.showListeningActivity ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium text-sm md:text-base">Allow Direct Messages</div>
                          <div className="text-white/60 text-xs md:text-sm">Allow other users to send you messages</div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('privacy', 'allowMessages', !settings.privacy.allowMessages)}
                          className={`w-10 h-6 md:w-12 md:h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            settings.privacy.allowMessages ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-transform ${
                            settings.privacy.allowMessages ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'playback' && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Playback Settings</h2>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">Streaming Quality</label>
                        <select
                          value={settings.playback.quality}
                          onChange={(e) => handleSettingChange('playback', 'quality', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none text-sm md:text-base"
                        >
                          <option value="low">Low (96kbps)</option>
                          <option value="medium">Medium (160kbps)</option>
                          <option value="high">High (320kbps)</option>
                          <option value="very-high">Very High (Lossless)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/80 mb-2 text-sm md:text-base">
                          Crossfade: {settings.playback.crossfade}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="12"
                          step="1"
                          value={settings.playback.crossfade}
                          onChange={(e) => handleSettingChange('playback', 'crossfade', parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 md:[&::-webkit-slider-thumb]:h-4 md:[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                        />
                        <div className="flex justify-between text-white/60 text-xs md:text-sm mt-1">
                          <span>Off</span>
                          <span>12s</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium text-sm md:text-base">Gapless Playback</div>
                          <div className="text-white/60 text-xs md:text-sm">Play tracks without gaps between them</div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('playback', 'gapless', !settings.playback.gapless)}
                          className={`w-10 h-6 md:w-12 md:h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            settings.playback.gapless ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-transform ${
                            settings.playback.gapless ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium text-sm md:text-base">Normalize Volume</div>
                          <div className="text-white/60 text-xs md:text-sm">Adjust volume levels across tracks</div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('playback', 'normalizeVolume', !settings.playback.normalizeVolume)}
                          className={`w-10 h-6 md:w-12 md:h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            settings.playback.normalizeVolume ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        >
                          <div className={`absolute top-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white transition-transform ${
                            settings.playback.normalizeVolume ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Subscription & Billing</h2>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
                          <div className="mb-3 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold">Premium Plan</h3>
                            <p className="text-white/70 text-sm md:text-base">Active until Jan 30, 2024</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs md:text-sm font-medium w-fit">
                            Active
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                          <div>
                            <div className="text-lg md:text-2xl font-bold">$9.99</div>
                            <div className="text-white/60 text-xs md:text-sm">Monthly</div>
                          </div>
                          <div>
                            <div className="text-lg md:text-2xl font-bold">Unlimited</div>
                            <div className="text-white/60 text-xs md:text-sm">Music</div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-colors text-sm md:text-base">
                          Manage Subscription
                        </button>
                      </div>
                      
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Payment Methods</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center space-x-3 md:space-x-4">
                              <div className="w-8 h-5 md:w-10 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm md:text-base truncate">Visa ending in 4242</div>
                                <div className="text-white/60 text-xs md:text-sm">Expires 12/2025</div>
                              </div>
                            </div>
                            <button className="text-white/70 hover:text-white text-sm md:text-base">Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base ${
                          hasChanges && !isSaving
                            ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                            : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }`}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      {hasChanges && (
                        <button
                          onClick={handleReset}
                          className="px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors text-sm md:text-base"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    
                    {activeTab === 'account' && (
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-sm md:text-base w-full sm:w-auto"
                      >
                        Delete Account
                      </button>
                    )}
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