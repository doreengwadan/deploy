"use client"

import Header from '../componets/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
    '/khed2.jpg', // Add your other images
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {/* Rotating Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Left Side Background Image */}
            <div 
              className="absolute left-0 top-16 w-1/2 h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${image}")`,
                maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
          </div>
        ))}
        
        {/* Image Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-purple-400 scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="text-left">
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to <span className="text-purple-400">Kheman MusicStream</span>
              </h1>
              <p className="text-white/70 text-xl mb-8 leading-relaxed">
                Discover millions of songs, create your perfect playlists, and share your musical journey with the world.
              </p>
              
              {/* Feature List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80">Stream unlimited music</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80">Create personalized playlists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80">Discover new artists daily</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex space-x-4">
                {/* Start Listening Button with Link */}
                <Link href="/khedman-songs">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                    Start Listening
                  </button>
                </Link>
                
                {/* Learn More Button with Link */}
                <Link href="/about-khedman">
                  <button className="bg-transparent border border-white/30 hover:border-white/50 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-white/10">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recently Released Songs - Right Side */}
          <div className="w-80 ml-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-6 bg-purple-400 rounded-full mr-3"></span>
                Recently Released
              </h2>
              
              <div className="space-y-4">
                {recentSongs.map((song) => (
                  <div 
                    key={song.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Album Cover Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ALBUM</span>
                    </div>
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-white/60 text-sm truncate">{song.artist}</p>
                    </div>
                    
                    {/* Duration & Play Button */}
                    <div className="flex items-center space-x-3">
                      <span className="text-white/50 text-sm">{song.duration}</span>
                      <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All Button */}
              <button className="w-full mt-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300">
                View All New Releases
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}