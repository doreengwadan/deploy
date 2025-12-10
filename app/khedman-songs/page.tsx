"use client"

import { useState, useEffect } from 'react'
import Header from '../../componets/Header'

export default function SongsPage() {
  // Sample songs data (you can move this to a separate data file)
  const allSongs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Ava Luna",
      album: "Electric Nights",
      duration: "3:45",
      cover: "/covers/song1.jpg",
      genre: "Electronic"
    },
    {
      id: 2,
      title: "Neon Lights",
      artist: "The Synthetics",
      album: "City Pulse",
      duration: "4:20",
      cover: "/covers/song2.jpg",
      genre: "Synthwave"
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Coastal Breeze",
      album: "Serenity",
      duration: "3:15",
      cover: "/covers/song3.jpg",
      genre: "Ambient"
    },
    {
      id: 4,
      title: "Digital Love",
      artist: "Cyber Pulse",
      album: "Future Heart",
      duration: "3:58",
      cover: "/covers/song4.jpg",
      genre: "Electronic"
    },
    {
      id: 5,
      title: "City Lights",
      artist: "Urban Flow",
      album: "Metropolitan",
      duration: "4:12",
      cover: "/covers/song5.jpg",
      genre: "Pop"
    },
    {
      id: 6,
      title: "Desert Sun",
      artist: "Sandstorm",
      album: "Horizon",
      duration: "3:30",
      cover: "/covers/song6.jpg",
      genre: "World"
    },
    {
      id: 7,
      title: "Mountain High",
      artist: "Peak Experience",
      album: "Summit",
      duration: "5:22",
      cover: "/covers/song7.jpg",
      genre: "Rock"
    },
    {
      id: 8,
      title: "Deep Space",
      artist: "Cosmic Drift",
      album: "Galaxy",
      duration: "6:15",
      cover: "/covers/song8.jpg",
      genre: "Ambient"
    },
    {
      id: 9,
      title: "Summer Breeze",
      artist: "Tropical Vibes",
      album: "Island Dreams",
      duration: "3:45",
      cover: "/covers/song9.jpg",
      genre: "Pop"
    },
    {
      id: 10,
      title: "Winter Frost",
      artist: "Arctic Chill",
      album: "Frozen Echoes",
      duration: "4:05",
      cover: "/covers/song10.jpg",
      genre: "Ambient"
    },
    {
      id: 11,
      title: "Electric Storm",
      artist: "Voltage",
      album: "Power Grid",
      duration: "3:50",
      cover: "/covers/song11.jpg",
      genre: "Electronic"
    },
    {
      id: 12,
      title: "Golden Hour",
      artist: "Sunset Glow",
      album: "Twilight",
      duration: "4:18",
      cover: "/covers/song12.jpg",
      genre: "Indie"
    }
  ]

  const [filteredSongs, setFilteredSongs] = useState(allSongs)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('default')

  // Background images array from homepage
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

  // Get all unique genres
  const allGenres = Array.from(new Set(allSongs.map(song => song.genre)))

  // Handle filter changes
  useEffect(() => {
    let songs = [...allSongs]

    // Apply search filter
    if (searchQuery) {
      songs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      songs = songs.filter(song => selectedGenres.includes(song.genre))
    }

    // Apply category filter
    if (activeFilter === 'trending') {
      // Sort by plays/likes - for demo, randomize
      songs = songs.sort(() => Math.random() - 0.5).slice(0, 8)
    } else if (activeFilter === 'new') {
      // Show newest - for demo, reverse order
      songs = songs.slice().reverse()
    } else if (activeFilter === 'playlists') {
      // Filter playlists - you can implement playlist logic here
      songs = songs.slice(0, 4)
    }

    // Apply sorting
    if (sortBy === 'title') {
      songs.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'artist') {
      songs.sort((a, b) => a.artist.localeCompare(b.artist))
    } else if (sortBy === 'duration') {
      songs.sort((a, b) => {
        const timeA = a.duration.split(':').map(Number)
        const timeB = b.duration.split(':').map(Number)
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
      })
    }

    setFilteredSongs(songs)
  }, [searchQuery, activeFilter, selectedGenres, sortBy])

  const handlePlaySong = (id: number) => {
    setCurrentPlaying(currentPlaying === id ? null : id)
    // Here you would integrate with your audio player
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Image Container - Similar to Homepage */}
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
              className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${image}")`,
                maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
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

      <div className="relative z-10">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Browse All Songs</h1>
            <p className="text-gray-400">Discover and play your favorite tracks</p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                className="w-full p-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                className="w-5 h-5 absolute left-4 top-3.5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              <button 
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === 'all' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All Songs
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === 'trending' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('trending')}
              >
                Trending
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === 'new' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('new')}
              >
                New Releases
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === 'playlists' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('playlists')}
              >
                Playlists
              </button>
            </div>

            {/* Genre Filters */}
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                {allGenres.map(genre => (
                  <button
                    key={genre}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedGenres.includes(genre)
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-white/10 hover:bg-white/20 text-white/70'
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
                {selectedGenres.length > 0 && (
                  <button
                    className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                    onClick={() => setSelectedGenres([])}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <div 
                key={song.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  {/* Album Cover */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ALBUM</span>
                    </div>
                    {/* Play Button Overlay */}
                    <button
                      onClick={() => handlePlaySong(song.id)}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        currentPlaying === song.id ? 'opacity-100' : ''
                      }`}
                    >
                      {currentPlaying === song.id ? (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-white/60 text-sm truncate">{song.artist}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-white/40 text-xs">{song.album}</p>
                      <div className="flex items-center space-x-3">
                        <span className="text-white/50 text-sm">{song.duration}</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {song.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                  <button 
                    className="p-2 hover:text-purple-300 transition-colors"
                    title="Add to queue"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 hover:text-purple-300 transition-colors"
                    title="Add to playlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 hover:text-purple-300 transition-colors"
                    title="Like"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 hover:text-purple-300 transition-colors"
                    title="More options"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredSongs.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No songs found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedGenres([])
                  setActiveFilter('all')
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          {filteredSongs.length > 0 && (
            <div className="mt-8 text-center text-gray-400">
              Showing {filteredSongs.length} of {allSongs.length} songs
            </div>
          )}
        </main>
      </div>
    </div>
  )
}