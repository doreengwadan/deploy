"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../componets/Header'

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
                Welcome to <span className="text-purple-400"></span>
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