"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../componets/Header'

// Define Song type matching your database schema
interface Song {
  id: number
  title: string
  artist: string
  album: string | null
  genre: string | null
  duration: string | null
  cover_url: string | null
  audio_url: string
  file_name: string
  file_size: number
  file_type: string
  release_date: string | null
  description: string | null
  is_explicit: boolean
  is_public: boolean
  uploaded_at: string
}

export default function Home() {
  // State for songs from database
  const [recentSongs, setRecentSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalSongs, setTotalSongs] = useState(0)

  // Background images array
  const backgroundImages = [
    '/khed.jpg',
    '/khed2.jpg',
    '/khed3.jpg',
    '/khed5.jpg'
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch songs from database
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true)
        console.log('Fetching songs from API...')
        
        const response = await fetch('/api/songs?limit=4&sort=desc')
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch songs: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Songs data received:', data)
        
        if (data && Array.isArray(data.songs)) {
          setRecentSongs(data.songs)
          setTotalSongs(data.total || data.songs.length)
          setError(null)
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (err) {
        console.error('Error fetching songs:', err)
        setError('Failed to load songs. Please try again later.')
        // Fallback to empty array
        setRecentSongs([])
        setTotalSongs(0)
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [])

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    setCurrentImageIndex(index)
  }

  const handleViewAllClick = () => {
    console.log('View All button clicked')
    // You can navigate to a songs page
    // router.push('/songs')
  }

  const handleSongPlayClick = (songId: number, songUrl: string) => {
    console.log('Play button clicked for song:', songId)
    console.log('Audio URL:', songUrl)
    
    // Create a hidden audio element and play the song
    const audio = new Audio(songUrl)
    audio.play().catch(e => {
      console.error('Error playing audio:', e)
      alert('Failed to play audio. Please check your connection and try again.')
    })
    
    // You could also update a global player state here
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Calculate duration from file size or use stored duration
  const getSongDuration = (song: Song) => {
    if (song.duration) return song.duration
    
    // Estimate duration based on file size (very rough estimate)
    // Average bitrate for MP3 is 128 kbps = 16 KB/s
    const bytesPerSecond = 16 * 1024 // 16KB per second for 128kbps
    const seconds = Math.floor(song.file_size / bytesPerSecond)
    
    if (seconds < 60) return `${seconds} sec`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Get cover image or fallback gradient
  const getSongCover = (song: Song) => {
    if (song.cover_url) return song.cover_url
    
    // Return a gradient based on song ID for consistency
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-green-500',
      'from-yellow-500 to-orange-500'
    ]
    
    return gradients[song.id % gradients.length]
  }

  // Get first letter for fallback cover
  const getFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase()
  }

  // Refresh songs
  const handleRefreshSongs = () => {
    setLoading(true)
    fetch('/api/songs?limit=4&sort=desc')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.songs)) {
          setRecentSongs(data.songs)
          setTotalSongs(data.total || data.songs.length)
          setError(null)
        }
      })
      .catch(err => {
        console.error('Error refreshing songs:', err)
        setError('Failed to refresh songs')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      <Header />
      
      {/* Background Image Container - Optimized for Mobile */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image - Optimized for both mobile and desktop */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${image}")`,
                backgroundSize: isMobile ? 'cover' : 'auto',
                backgroundPosition: isMobile ? 'center' : 'left',
              }}
            />
            
            {/* Gradient Overlay - Mobile optimized */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/70 md:bg-gradient-to-r md:from-slate-900/90 md:via-slate-900/50 md:to-transparent" />
          </div>
        ))}
        
        {/* Image Indicator Dots - Better mobile positioning */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-purple-400 scale-110' 
                  : 'bg-white/40 hover:bg-white/60'
              } ${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content - Enhanced Mobile Responsiveness */}
      <main className="relative z-10">
        {/* Mobile: Full width content with proper padding */}
        <div className="px-4 sm:px-6 pt-20 pb-24 md:pb-8 md:pt-28 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:gap-8">
            {/* Hero Section - Mobile First */}
            <div className="mb-8 md:mb-10 lg:mb-0 lg:flex-1">
              <div className="text-left">
                {/* Main Heading - Better mobile sizing */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight">
                  Welcome to{' '}
                  <span className="text-purple-400 italic block sm:inline">Mayembe music stream</span>
                </h1>
                
                {/* Description - Improved mobile readability */}
                <div className="space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
                  <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                    Discover millions of songs, create perfect playlists, and share your musical journey.
                  </p>
                  <p className="text-purple-300 italic text-sm sm:text-base md:text-lg leading-relaxed">
                    Mutha kuonera kapena kuvera nyimbo za chimalawi komaso ngati ndinu oimba mukhoza 
                    kupangitsa upload nyimbo zanu pano pa mtengo wotchipa
                  </p>
                </div>
                
                {/* Stats - Show total uploaded songs */}
                <div className="flex items-center space-x-6 mb-4 sm:mb-6 md:mb-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400">{totalSongs}</div>
                    <div className="text-white/60 text-sm">Total Songs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-pink-400">{recentSongs.length}</div>
                    <div className="text-white/60 text-sm">Recently Added</div>
                  </div>
                </div>
                
                {/* Feature List - Better mobile spacing */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <span className="text-white/80 text-sm sm:text-base">Stream unlimited music</span>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <span className="text-white/80 text-sm sm:text-base">Create personalized playlists</span>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <span className="text-white/80 text-sm sm:text-base">Discover new artists daily</span>
                  </div>
                </div>
                
                {/* CTA Buttons - Better mobile buttons */}
                <div className="flex flex-col xs:flex-row xs:flex-wrap gap-3 sm:gap-4">
                  <Link href="/upload" className="flex-1 min-w-[140px]">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 hover:scale-105 text-sm sm:text-base shadow-lg flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Upload Music</span>
                    </button>
                  </Link>
                  
                  <Link href="/khedman-songs" className="flex-1 min-w-[140px]">
                    <button className="w-full bg-transparent border border-white/30 hover:border-white/50 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 hover:bg-white/10 text-sm sm:text-base flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Browse All Songs</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recently Released Songs - Better mobile card */}
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-0 lg:w-96 lg:flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center">
                    <span className="w-1.5 h-4 sm:h-5 md:h-6 bg-purple-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Recently Uploaded</h2>
                  </div>
                  <button 
                    onClick={handleRefreshSongs}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    disabled={loading}
                  >
                    <svg 
                      className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-4"></div>
                    <p className="text-white/60 text-sm">Loading songs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <div className="text-red-400 mb-2">{error}</div>
                    <button 
                      onClick={handleRefreshSongs}
                      className="text-purple-300 hover:text-purple-400 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : recentSongs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <p className="text-white/60 mb-2">No songs uploaded yet</p>
                    <p className="text-white/40 text-sm mb-4">Be the first to upload a song!</p>
                    <Link href="/upload">
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                        Upload Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 sm:space-y-3">
                      {recentSongs.map((song) => (
                        <div 
                          key={song.id}
                          className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-white/10 active:bg-white/15 transition-all duration-300 cursor-pointer group"
                          onClick={() => console.log('Song clicked:', song.id)}
                        >
                          {/* Album Cover - Responsive sizing */}
                          <div 
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4 overflow-hidden ${
                              song.cover_url ? '' : `bg-gradient-to-br ${getSongCover(song)}`
                            }`}
                            style={song.cover_url ? { backgroundImage: `url("${song.cover_url}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            {!song.cover_url && (
                              <span className="text-white text-sm md:text-base font-bold">
                                {getFirstLetter(song.title)}
                              </span>
                            )}
                          </div>
                          
                          {/* Song Info - Better truncation */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate text-sm sm:text-base md:text-lg group-hover:text-purple-300 transition-colors">
                              {song.title}
                              {song.is_explicit && (
                                <span className="ml-2 px-1 bg-red-500/20 text-red-300 text-xs rounded">E</span>
                              )}
                            </h3>
                            <p className="text-white/60 truncate text-xs sm:text-sm">{song.artist}</p>
                            {song.album && (
                              <p className="text-white/40 truncate text-xs">{song.album}</p>
                            )}
                          </div>
                          
                          {/* Duration & Play Button */}
                          <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                            <span className="text-white/50 text-xs sm:text-sm whitespace-nowrap">
                              {getSongDuration(song)}
                            </span>
                            <button 
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-95 transition-all duration-300 transform hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSongPlayClick(song.id, song.audio_url)
                              }}
                              title="Play song"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* View All Button */}
                    <Link href="/songs">
                      <button 
                        className="w-full mt-4 sm:mt-5 md:mt-6 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 active:bg-white/15 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2"
                      >
                        <span>View All Songs ({totalSongs})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </>
                )}
                
                {/* Upload Info */}
                {!loading && recentSongs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Updated just now</span>
                      </div>
                      <Link href="/upload" className="text-purple-300 hover:text-purple-400">
                        Upload your own
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Enhanced for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/20 md:hidden z-40 shadow-2xl">
          <div className="flex justify-around items-center py-2">
            <Link href="/" className="flex flex-col items-center p-2 active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-[10px] xs:text-xs text-white/90 mt-1">Home</span>
            </Link>
            
            <Link href="/songs" className="flex flex-col items-center p-2 active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-[10px] xs:text-xs text-white/70 mt-1">Songs</span>
            </Link>
            
            <Link href="/upload" className="flex flex-col items-center p-2 active:scale-95 transition-transform -mt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg active:shadow-xl active:scale-95 transition-all">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[10px] xs:text-xs text-white/70 mt-1">Upload</span>
            </Link>
            
            <Link href="/search" className="flex flex-col items-center p-2 active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[10px] xs:text-xs text-white/70 mt-1">Search</span>
            </Link>
            
            <Link href="/profile" className="flex flex-col items-center p-2 active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] xs:text-xs text-white/70 mt-1">Profile</span>
            </Link>
          </div>
          
          {/* iPhone X+ Safe Area Bottom Spacer */}
          <div className="h-0 safe-area-bottom"></div>
        </div>
      </main>

      {/* Mobile Safe Area CSS */}
      <style jsx>{`
        .safe-area-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }
        
        @media (max-width: 640px) {
          /* Better touch targets for mobile */
          button, 
          a,
          [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Prevent text size adjustment on mobile */
        @media (max-width: 768px) {
          html {
            -webkit-text-size-adjust: 100%;
          }
        }
      `}</style>
    </div>
  )
}