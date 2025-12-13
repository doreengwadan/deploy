"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true)
      try {
        const userData = localStorage.getItem('khedman_user')
        const sessionData = localStorage.getItem('khedman_session')
        
        if (userData && sessionData) {
          try {
            const parsedUser = JSON.parse(userData)
            const parsedSession = JSON.parse(sessionData)
            
            const currentTime = Date.now()
            if (parsedSession.expires_at > currentTime) {
              setUser(parsedUser)
            } else {
              localStorage.removeItem('khedman_user')
              localStorage.removeItem('khedman_session')
              setUser(null)
            }
          } catch (error) {
            localStorage.removeItem('khedman_user')
            localStorage.removeItem('khedman_session')
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    setTimeout(checkAuth, 100)
  }, [])

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('khedman_user')
      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleLogin = (): void => {
    router.push('/login')
  }

  const handleRegister = (): void => {
    router.push('/register')
  }

  const handleLogout = (): void => {
    localStorage.removeItem('khedman_user')
    localStorage.removeItem('khedman_session')
    setUser(null)
    setShowDropdown(false)
    window.dispatchEvent(new Event('storage'))
    router.push('/')
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  if (isLoading) {
    return (
      <header className="music-waves-bg text-white fixed top-0 left-0 right-0 z-50">
        <div className="header-glass">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 mr-8">
                <div className="w-10 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="w-32 h-6 bg-gray-700 rounded hidden sm:block animate-pulse"></div>
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="w-full h-12 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-8">
                <div className="w-32 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`music-waves-bg text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg bg-gray-900/95 backdrop-blur-md' : ''
    }`}>
      {/* Animated Music Notes - Remove overflow hidden if causing issues */}
      <div className="music-notes" style={{ overflow: 'visible' }}>
        {['♪', '♫', '🎵', '🎶', '♪', '♫', '🎵', '🎶'].map((note, index) => (
          <div key={index} className="music-note">
            {note}
          </div>
        ))}
      </div>
      
      {/* Header Content - Add relative positioning */}
      <div className="header-glass relative z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mr-8 group z-50">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-white text-xl font-bold hidden sm:block">Kheman MusicStream</span>
            </Link>

            
            {/* Right: User Profile or Auth Buttons */}
            <div className="ml-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Profile Button */}
                  <button 
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 border relative z-50 ${
                      showDropdown 
                        ? 'bg-white/20 border-white/40' 
                        : 'bg-white/10 hover:bg-white/15 border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-medium hidden md:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-white/60 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu - Fixed positioning */}
                  {showDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 py-2 z-[100] animate-fadeIn"
                      style={{ 
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        overflow: 'visible'
                      }}
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white/90 font-medium truncate">{user.name}</p>
                        <p className="text-xs text-white/60 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">My Profile</span>
                        </Link>
                        
                        <Link
                          href="/library"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-sm">My Library</span>
                        </Link>
                        
                        <Link
                          href="/uploads"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm">My Uploads</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">Settings</span>
                        </Link>
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogin}
                    className="bg-transparent border border-white/40 hover:border-white/60 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-white/10"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegister}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .music-waves-bg {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(76, 29, 149, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%);
          position: relative;
          /* Remove overflow: hidden if it's causing issues */
          /* overflow: hidden; */
        }

        .header-glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          position: relative;
          z-index: 40;
        }

        .music-notes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          /* Remove overflow hidden */
          /* overflow: hidden; */
          z-index: 1;
        }

        .music-note {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.1;
          animation: floatNote 8s linear infinite;
        }

        /* Music note positions... */

        @keyframes floatNote {
          0% {
            transform: translateY(100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100%) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}