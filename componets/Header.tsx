'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleLogin = (): void => {
    router.push('/login')
  }

  const handleRegister = (): void => {
    router.push('/apply')
  }

  const handleLogout = (): void => {
    setIsLoggedIn(false)
    console.log('Logout clicked')
    // In a real app, you would also clear tokens and redirect
    router.push('/')
  }

  return (
    <header className={`music-waves-bg text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg bg-gray-900/95 backdrop-blur-md' : ''
    }`}>
      {/* Animated Music Notes */}
      <div className="music-notes">
        {['♪', '♫', '🎵', '🎶', '♪', '♫', '🎵', '🎶'].map((note, index) => (
          <div key={index} className="music-note">
            {note}
          </div>
        ))}
      </div>
      
      {/* Header Content */}
      <div className="header-glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mr-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-white text-xl font-bold hidden sm:block">Kheman MusicStream</span>
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  placeholder="Search for music, artists, albums..."
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/15 transition-all duration-300 border border-white/20"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right: Auth Buttons */}
            <div className="ml-8">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/profile" 
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Welcome back!
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300 border border-white/30"
                  >
                    Logout
                  </button>
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
          overflow: hidden;
        }

        .header-glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .music-notes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .music-note {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.1;
          animation: floatNote 8s linear infinite;
        }

        .music-note:nth-child(1) { left: 5%; animation-delay: 0s; }
        .music-note:nth-child(2) { left: 15%; animation-delay: 1s; }
        .music-note:nth-child(3) { left: 25%; animation-delay: 2s; }
        .music-note:nth-child(4) { left: 35%; animation-delay: 3s; }
        .music-note:nth-child(5) { left: 45%; animation-delay: 4s; }
        .music-note:nth-child(6) { left: 55%; animation-delay: 5s; }
        .music-note:nth-child(7) { left: 65%; animation-delay: 6s; }
        .music-note:nth-child(8) { left: 75%; animation-delay: 7s; }

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
      `}</style>
    </header>
  )
}