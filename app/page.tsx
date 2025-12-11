"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Header Component
function Header() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
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
    if (window.innerWidth < 768) {
      setShowMobileSearch(false)
    }
  }

  const handleLogin = (): void => {
    router.push('/login')
    setShowMobileMenu(false)
  }

  const handleRegister = (): void => {
    router.push('/register')
    setShowMobileMenu(false)
  }

  const handleLogout = (): void => {
    setIsLoggedIn(false)
    console.log('Logout clicked')
    router.push('/')
    setShowMobileMenu(false)
  }

  return (
    <>
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
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo & Mobile Menu Button */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <span className="text-white text-xl font-bold hidden sm:block">Kheman Music</span>
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="flex-1 max-w-2xl hidden md:block mx-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search music..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/15 transition-all duration-300 border border-white/20 text-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Mobile Search Button */}
              <div className="flex items-center space-x-3 md:hidden">
                <button 
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {isLoggedIn ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full font-medium transition-colors duration-300 border border-white/30 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="bg-transparent border border-white/40 hover:border-white/60 text-white px-4 py-1.5 rounded-full font-medium transition-all duration-300 hover:bg-white/10 text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleRegister}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search for music, artists, albums..."
                className="w-full px-4 py-3 pl-12 pr-4 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/15 transition-all duration-300 border border-white/20"
                autoFocus
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
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/khedman-songs" 
                className="block text-white/80 hover:text-white transition-colors duration-300 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Browse Songs
              </Link>
              <Link 
                href="/about-khedman" 
                className="block text-white/80 hover:text-white transition-colors duration-300 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <div className="pt-3 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="block text-white/80 hover:text-white transition-colors duration-300 py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-full font-medium transition-colors duration-300 border border-white/30"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleLogin}
                      className="w-full bg-transparent border border-white/40 hover:border-white/60 text-white px-4 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-white/10"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleRegister}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-full font-medium transition-all duration-300"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

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
    </>
  )
}

// Home Component
export default function Home() {
  // Sample recently released songs data
  const recentSongs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Ava Luna",
      album: "Electric Nights",
      duration: "3:45",
      cover: "/covers/song1.jpg"
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "The Synthetics",
      album: "City Pulse",
      duration: "4:20",
      cover: "/covers/song2.jpg"
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Coastal Breeze",
      album: "Serenity",
      duration: "3:15",
      cover: "/covers/song3.jpg"
    },
    {
      id: 4,
      title: "Digital Love",
      artist: "Cyber Pulse",
      album: "Future Heart",
      duration: "3:58",
      cover: "/covers/song4.jpg"
    }
  ]

  // Background images array
  const backgroundImages = [
    '/khed.jpg',
    '/khed2.jpg',
    '/khed3.jpg',
    '/khed5.jpg'
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const handleDotClick = (index: number) => {
    console.log('Dot clicked:', index)
    setCurrentImageIndex(index)
  }

  const handleViewAllClick = () => {
    console.log('View All button clicked')
  }

  const handleSongPlayClick = (songId: number) => {
    console.log('Play button clicked for song:', songId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
      
      {/* Background Image Container - Mobile Optimized */}
      <div className="absolute inset-0 z-0">
        {/* Rotating Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Mobile Background Image - Full Screen */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url("${image}")`,
              }}
            />
            
            {/* Desktop Background Image */}
            <div 
              className="hidden md:block absolute left-0 top-16 w-1/2 h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${image}")`,
                maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent md:bg-gradient-to-r md:from-slate-900/80 md:via-slate-900/40 md:to-transparent" />
          </div>
        ))}
        
        {/* Image Indicator Dots - Mobile Bottom */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-purple-400 scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content - Mobile Optimized */}
      <main className="container mx-auto px-4 py-20 md:py-8 relative z-10">
        {/* Mobile: Single Column Layout */}
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Hero Section - Mobile Top */}
          <div className="mb-8 md:mb-0 md:max-w-2xl">
            <div className="text-left">
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Welcome to <span className="text-purple-400">Kheman Music</span>
              </h1>
              <p className="text-white/70 text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
                Discover millions of songs, create perfect playlists, and share your musical journey.
              </p>
              
              {/* Feature List - Mobile Compact */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80 text-sm md:text-base">Stream unlimited music</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80 text-sm md:text-base">Create personalized playlists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80 text-sm md:text-base">Discover new artists daily</span>
                </div>
              </div>
              
              {/* CTA Buttons - Mobile Stacked */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                <Link href="/khedman-songs">
                  <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 md:px-8 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
                    Start Listening
                  </button>
                </Link>
                
                <Link href="/about-khedman">
                  <button className="w-full md:w-auto bg-transparent border border-white/30 hover:border-white/50 text-white px-6 py-3 md:px-8 md:py-3 rounded-full font-semibold transition-all duration-300 hover:bg-white/10 text-sm md:text-base">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recently Released Songs - Mobile Below Hero */}
          <div className="mt-8 md:mt-0 md:w-80 md:ml-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                <span className="w-1.5 h-5 md:w-2 md:h-6 bg-purple-400 rounded-full mr-2 md:mr-3"></span>
                Recently Released
              </h2>
              
              <div className="space-y-3 md:space-y-4">
                {recentSongs.map((song) => (
                  <div 
                    key={song.id}
                    className="flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    onClick={() => console.log('Song clicked:', song.id)}
                  >
                    {/* Album Cover - Mobile Smaller */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">ALBUM</span>
                    </div>
                    
                    {/* Song Info - Mobile Truncated */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate text-sm md:text-base group-hover:text-purple-300 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-white/60 text-xs md:text-sm truncate">{song.artist}</p>
                    </div>
                    
                    {/* Duration & Play Button */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <span className="text-white/50 text-xs md:text-sm">{song.duration}</span>
                      <button 
                        className="w-7 h-7 md:w-8 md:h-8 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSongPlayClick(song.id)
                        }}
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All Button */}
              <button 
                className="w-full mt-4 md:mt-6 py-2.5 md:py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
                onClick={handleViewAllClick}
              >
                View All New Releases
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - App-like */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-white/10 md:hidden z-40">
          <div className="flex justify-around items-center py-3">
            <Link href="/" className="flex flex-col items-center">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs text-white/80 mt-1">Home</span>
            </Link>
            
            <Link href="/khedman-songs" className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-xs text-white/80 mt-1">Browse</span>
            </Link>
            
            <button className="flex flex-col items-center">
              <div className="w-12 h-12 -mt-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-white/80 mt-1">Play</span>
            </button>
            
            <Link href="/search" className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs text-white/80 mt-1">Search</span>
            </Link>
            
            <Link href="/profile" className="flex flex-col items-center">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-white/80 mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}