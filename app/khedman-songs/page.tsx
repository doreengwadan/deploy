"use client"

import { useState, useEffect } from 'react'
import Header from '../../componets/Header'

export default function SongsPage() {
  // Sample songs data
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
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list')

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
      songs = songs.sort(() => Math.random() - 0.5).slice(0, 8)
    } else if (activeFilter === 'new') {
      songs = songs.slice().reverse()
    } else if (activeFilter === 'playlists') {
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
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedGenres([])
    setActiveFilter('all')
    setSortBy('default')
    setShowFilters(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchActive(false)
  }

  // Mobile App-like Layout Components
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Mobile App Header - Simplified */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button className="p-2" onClick={() => window.history.back()}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold">Browse Songs</h1>

            {/* Search Toggle */}
            <button 
              className="p-2"
              onClick={() => setIsSearchActive(!isSearchActive)}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Search Bar - App Style */}
          {isSearchActive && (
            <div className="mt-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-white text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Main Content with Mobile App Padding */}
      <main className={`flex-1 overflow-y-auto ${
        isSearchActive ? 'pt-24' : 'pt-16 md:pt-0'
      } pb-20 md:pb-6`}>
        <div className="p-4 md:p-6">
          {/* Desktop Search Bar */}
          <div className="hidden md:block mb-6">
            <form onSubmit={handleSearchSubmit} className="relative max-w-md">
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          {/* Quick Filters Bar - Mobile App Style */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex overflow-x-auto space-x-2 pb-2 flex-1">
                {/* View Toggle - Mobile Only */}
                <div className="md:hidden flex items-center bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      currentView === 'list' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setCurrentView('grid')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      currentView === 'grid' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400'
                    }`}
                  >
                    Grid
                  </button>
                </div>

                {/* Filter Buttons */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                    showFilters || selectedGenres.length > 0 || activeFilter !== 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {(selectedGenres.length > 0 || activeFilter !== 'all') && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  )}
                </button>

                {/* Quick Genre Filters */}
                {['All', 'Electronic', 'Pop', 'Rock'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      if (genre === 'All') {
                        setSelectedGenres([])
                        setActiveFilter('all')
                      } else {
                        toggleGenre(genre)
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                      (genre === 'All' && activeFilter === 'all' && selectedGenres.length === 0) ||
                      selectedGenres.includes(genre)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Sort Button - Mobile */}
              <button 
                className="md:hidden p-2 bg-gray-800 rounded-lg ml-2"
                onClick={() => {
                  // Show sort options modal
                  const sortOption = prompt('Sort by: title, artist, duration', sortBy)
                  if (sortOption) setSortBy(sortOption)
                }}
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Panel - Mobile Drawer Style */}
          {showFilters && (
            <div className="mb-4 bg-gray-900 rounded-xl p-4 border border-gray-800 animate-slideDown">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Filters */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-sm mb-2">Category</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'all', label: 'All Songs', icon: '🎵' },
                    { key: 'trending', label: 'Trending', icon: '🔥' },
                    { key: 'new', label: 'New', icon: '🆕' },
                    { key: 'playlists', label: 'Playlists', icon: '📋' }
                  ].map((filter) => (
                    <button 
                      key={filter.key}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                        activeFilter === filter.key 
                          ? 'bg-purple-600' 
                          : 'bg-gray-800'
                      }`}
                      onClick={() => {
                        setActiveFilter(filter.key)
                        setShowFilters(false)
                      }}
                    >
                      <span className="text-lg mb-1">{filter.icon}</span>
                      <span className="text-xs">{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filters */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-sm mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map(genre => (
                    <button
                      key={genre}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          {filteredSongs.length > 0 && (
            <div className="mb-3 text-gray-400 text-sm">
              {searchQuery ? (
                <div className="flex items-center justify-between">
                  <span>{filteredSongs.length} results</span>
                  <button
                    onClick={clearSearch}
                    className="text-purple-400 text-xs"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <span>{filteredSongs.length} songs</span>
              )}
            </div>
          )}

          {/* Songs List - Mobile App Style */}
          <div className={currentView === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
            {filteredSongs.map((song) => (
              <div 
                key={song.id}
                className={`group bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer ${
                  currentView === 'grid' ? 'p-3' : 'p-3'
                }`}
                onClick={() => console.log('Song selected:', song.id)}
              >
                <div className={`flex items-center ${currentView === 'grid' ? 'flex-col text-center' : ''}`}>
                  {/* Album Cover - Mobile Optimized */}
                  <div className={`relative ${currentView === 'grid' ? 'mb-3' : 'mr-3'}`}>
                    <div className={`${
                      currentView === 'grid' 
                        ? 'w-full aspect-square' 
                        : 'w-12 h-12'
                    } bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">ALBUM</span>
                    </div>
                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlaySong(song.id)
                      }}
                      className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                        currentPlaying === song.id ? 'opacity-100 bg-purple-600/60' : ''
                      }`}
                    >
                      {currentPlaying === song.id ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Song Info */}
                  <div className={`flex-1 min-w-0 ${currentView === 'grid' ? 'w-full' : ''}`}>
                    <h3 className="text-white font-medium truncate text-sm">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      currentView === 'grid' ? 'flex-col gap-1' : ''
                    }`}>
                      <p className="text-gray-500 text-xs truncate">{song.album}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">{song.duration}</span>
                        <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">
                          {song.genre}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Menu - Mobile Style */}
                  <button 
                    className={`p-2 text-gray-400 hover:text-white ${
                      currentView === 'grid' ? 'absolute top-2 right-2' : 'ml-2'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Show action sheet
                      console.log('Show actions for:', song.title)
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State - Mobile App Style */}
          {filteredSongs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No songs found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try changing your filters'}
              </p>
              <button
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar - App Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </button>
          
          {/* Browse */}
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs text-purple-400 mt-1">Browse</span>
          </button>
          
          {/* Play */}
          <button className="flex flex-col items-center p-2 -mt-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400 mt-1">Play</span>
          </button>
          
          {/* Library */}
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Library</span>
          </button>
          
          {/* Profile */}
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block relative z-10">
        {/* ... keep your existing desktop content here ... */}
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}