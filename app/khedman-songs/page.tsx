"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../../componets/Header'

// Define extended Song type with interaction data
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
  likes?: number
  dislikes?: number
  downloads?: number
  plays?: number
  userLiked?: boolean
  userDisliked?: boolean
  userDownloaded?: boolean
}

// Extended interface for song with interactions
interface SongWithInteractions extends Song {
  likes: number
  dislikes: number
  downloads: number
  plays: number
  userLiked: boolean
  userDisliked: boolean
  userDownloaded: boolean
  isPlaying: boolean
}

export default function SongsPage() {
  // State for songs from database with interactions
  const [allSongs, setAllSongs] = useState<SongWithInteractions[]>([])
  const [filteredSongs, setFilteredSongs] = useState<SongWithInteractions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list')
  const [totalSongs, setTotalSongs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [updatingSongId, setUpdatingSongId] = useState<number | null>(null)

  // Get all unique genres from songs
  const allGenres = Array.from(new Set(allSongs.map(song => song.genre).filter(Boolean) as string[]))

  // Fetch songs from database with interactions
  const fetchSongs = useCallback(async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setAllSongs([])
        setFilteredSongs([])
      } else if (page > 1) {
        setIsLoadingMore(true)
      }
      
      console.log(`Fetching songs page ${page}...`)
      
      const limit = 20
      const offset = (page - 1) * limit
      
      const response = await fetch(`/api/songs?limit=${limit}&offset=${offset}&sort=desc`)
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`Fetched ${data.songs?.length || 0} songs`)
      
      if (data && Array.isArray(data.songs)) {
        // Add interaction data to songs
        const songsWithInteractions = data.songs.map((song: Song) => ({
          ...song,
          likes: song.likes || 0,
          dislikes: song.dislikes || 0,
          downloads: song.downloads || 0,
          plays: song.plays || 0,
          userLiked: song.userLiked || false,
          userDisliked: song.userDisliked || false,
          userDownloaded: song.userDownloaded || false,
          isPlaying: false
        }))
        
        if (reset || page === 1) {
          setAllSongs(songsWithInteractions)
          setTotalSongs(data.total || 0)
        } else {
          setAllSongs(prev => [...prev, ...songsWithInteractions])
        }
        
        setHasMore(data.songs.length === limit)
        setError(null)
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (err) {
      console.error('Error fetching songs:', err)
      if (reset || page === 1) {
        setError('Failed to load songs. Please try again later.')
      } else {
        setError('Failed to load more songs')
      }
    } finally {
      if (reset || page === 1) {
        setLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchSongs(1, true)
  }, [fetchSongs])

  // Handle audio player
  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ''
      }
    }
  }, [currentAudio])

  // Record interaction with database
  const recordInteraction = useCallback(async (songId: number, action: 'like' | 'dislike' | 'download' | 'play') => {
    try {
      setUpdatingSongId(songId)
      const response = await fetch(`/api/songs/${songId}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to record ${action}`);
      }

      const data = await response.json();
      return data.song;
    } catch (error) {
      console.error(`Failed to record ${action}:`, error);
      throw error;
    } finally {
      setUpdatingSongId(null)
    }
  }, []);

  // Toggle like/dislike
  const toggleLikeDislike = useCallback(async (songId: number, newAction: 'like' | 'dislike', previousAction: 'like' | 'dislike' | null) => {
    try {
      setUpdatingSongId(songId)
      const response = await fetch(`/api/songs/${songId}/interact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: newAction, 
          previousAction 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to toggle ${newAction}`);
      }

      const data = await response.json();
      return data.song;
    } catch (error) {
      console.error(`Failed to toggle ${newAction}:`, error);
      throw error;
    } finally {
      setUpdatingSongId(null)
    }
  }, []);

  const playSong = useCallback(async (songId: number, audioUrl: string) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      setCurrentPlayingId(null)
    }

    // Update playing state for all songs
    setAllSongs(prev => prev.map(song => ({
      ...song,
      isPlaying: song.id === songId
    })))
    setFilteredSongs(prev => prev.map(song => ({
      ...song,
      isPlaying: song.id === songId
    })))

    const audio = new Audio(audioUrl)
    
    try {
      await audio.play()
      setCurrentPlayingId(songId)
      setCurrentAudio(audio)
      
      // Record play in database
      try {
        await recordInteraction(songId, 'play')
        // Update local state with new play count
        setAllSongs(prev => prev.map(song => 
          song.id === songId 
            ? { ...song, plays: (song.plays || 0) + 1 }
            : song
        ))
      } catch (playError) {
        console.error('Failed to record play:', playError)
        // Don't stop playback if play recording fails
      }
      
      // Listen for when audio ends
      audio.onended = () => {
        setCurrentPlayingId(null)
        setAllSongs(prev => prev.map(song => ({
          ...song,
          isPlaying: false
        })))
        setFilteredSongs(prev => prev.map(song => ({
          ...song,
          isPlaying: false
        })))
      }
    } catch (e) {
      console.error('Error playing audio:', e)
      alert('Failed to play audio. Please check your connection and try again.')
      
      // Reset playing state on error
      setAllSongs(prev => prev.map(song => ({
        ...song,
        isPlaying: false
      })))
      setFilteredSongs(prev => prev.map(song => ({
        ...song,
        isPlaying: false
      })))
    }
  }, [currentAudio, recordInteraction])

  const pauseSong = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentPlayingId(null)
      setAllSongs(prev => prev.map(song => ({
        ...song,
        isPlaying: false
      })))
      setFilteredSongs(prev => prev.map(song => ({
        ...song,
        isPlaying: false
      })))
    }
  }, [currentAudio])

  const togglePlayPause = useCallback((songId: number, audioUrl: string) => {
    if (currentPlayingId === songId) {
      pauseSong()
    } else {
      playSong(songId, audioUrl)
    }
  }, [currentPlayingId, playSong, pauseSong])

  // Download functionality
  const handleDownload = useCallback(async (songId: number, songTitle: string, audioUrl: string) => {
    try {
      console.log(`Downloading song ${songId}: ${songTitle}`)
      
      // Update database first
      const updatedSong = await recordInteraction(songId, 'download')
      
      // Update local state with new download count
      if (updatedSong) {
        setAllSongs(prev => prev.map(song => 
          song.id === songId 
            ? { 
                ...song, 
                downloads: updatedSong.downloads || song.downloads + 1,
                userDownloaded: true 
              }
            : song
        ))
      } else {
        // Fallback if API call fails
        setAllSongs(prev => prev.map(song => 
          song.id === songId 
            ? { ...song, downloads: song.downloads + 1, userDownloaded: true }
            : song
        ))
      }
      
      // Download the file
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download song. Please try again.')
    }
  }, [recordInteraction])

  // Like functionality
  const handleLike = useCallback(async (songId: number) => {
    try {
      const song = allSongs.find(s => s.id === songId)
      if (!song) return

      const alreadyLiked = song.userLiked
      const alreadyDisliked = song.userDisliked

      if (alreadyLiked) {
        // Unlike - toggle to dislike if they click like again
        const updatedSong = await toggleLikeDislike(songId, 'dislike', 'like')
        if (updatedSong) {
          setAllSongs(prev => prev.map(s => 
            s.id === songId 
              ? { 
                  ...s, 
                  likes: updatedSong.likes || s.likes - 1,
                  dislikes: updatedSong.dislikes || s.dislikes + 1,
                  userLiked: false,
                  userDisliked: true
                }
              : s
          ))
        }
      } else {
        // Like
        let updatedSong
        if (alreadyDisliked) {
          // Switch from dislike to like
          updatedSong = await toggleLikeDislike(songId, 'like', 'dislike')
        } else {
          // First time like
          updatedSong = await recordInteraction(songId, 'like')
        }
        
        if (updatedSong) {
          setAllSongs(prev => prev.map(s => 
            s.id === songId 
              ? { 
                  ...s, 
                  likes: updatedSong.likes || s.likes + 1,
                  dislikes: updatedSong.dislikes || (alreadyDisliked ? s.dislikes - 1 : s.dislikes),
                  userLiked: true,
                  userDisliked: false
                }
              : s
          ))
        }
      }
    } catch (error) {
      console.error('Like failed:', error)
      alert('Failed to update like. Please try again.')
    }
  }, [allSongs, recordInteraction, toggleLikeDislike])

  // Dislike functionality
  const handleDislike = useCallback(async (songId: number) => {
    try {
      const song = allSongs.find(s => s.id === songId)
      if (!song) return

      const alreadyDisliked = song.userDisliked
      const alreadyLiked = song.userLiked

      if (alreadyDisliked) {
        // Remove dislike - toggle to like
        const updatedSong = await toggleLikeDislike(songId, 'like', 'dislike')
        if (updatedSong) {
          setAllSongs(prev => prev.map(s => 
            s.id === songId 
              ? { 
                  ...s, 
                  likes: updatedSong.likes || s.likes + 1,
                  dislikes: updatedSong.dislikes || s.dislikes - 1,
                  userLiked: true,
                  userDisliked: false
                }
              : s
          ))
        }
      } else {
        // Dislike
        let updatedSong
        if (alreadyLiked) {
          // Switch from like to dislike
          updatedSong = await toggleLikeDislike(songId, 'dislike', 'like')
        } else {
          // First time dislike
          updatedSong = await recordInteraction(songId, 'dislike')
        }
        
        if (updatedSong) {
          setAllSongs(prev => prev.map(s => 
            s.id === songId 
              ? { 
                  ...s, 
                  likes: updatedSong.likes || (alreadyLiked ? s.likes - 1 : s.likes),
                  dislikes: updatedSong.dislikes || s.dislikes + 1,
                  userLiked: false,
                  userDisliked: true
                }
              : s
          ))
        }
      }
    } catch (error) {
      console.error('Dislike failed:', error)
      alert('Failed to update dislike. Please try again.')
    }
  }, [allSongs, recordInteraction, toggleLikeDislike])

  // Load more songs when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !isLoadingMore &&
        !loading
      ) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchSongs(nextPage)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoadingMore, loading, currentPage, fetchSongs])

  // Apply filters to songs
  useEffect(() => {
    if (!allSongs.length) return

    let songs = [...allSongs]

    // Apply search filter
    if (searchQuery) {
      songs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      songs = songs.filter(song => song.genre && selectedGenres.includes(song.genre))
    }

    // Apply category filter
    if (activeFilter === 'trending') {
      // Sort by likes + downloads + plays for trending
      songs = [...songs].sort((a, b) => 
        (b.likes + b.downloads * 0.5 + b.plays * 0.3) - (a.likes + a.downloads * 0.5 + a.plays * 0.3)
      ).slice(0, 8)
    } else if (activeFilter === 'new') {
      // Newest first (already sorted by uploaded_at desc from API)
    } else if (activeFilter === 'playlists') {
      // Show most liked songs
      songs = [...songs].sort((a, b) => b.likes - a.likes).slice(0, 4)
    } else if (activeFilter === 'popular') {
      songs = [...songs].sort((a, b) => 
        (b.downloads * 2 + b.likes + b.plays * 0.5) - (a.downloads * 2 + a.likes + a.plays * 0.5)
      )
    } else if (activeFilter === 'most-played') {
      songs = [...songs].sort((a, b) => b.plays - a.plays)
    }

    // Apply sorting
    if (sortBy === 'title') {
      songs.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'artist') {
      songs.sort((a, b) => a.artist.localeCompare(b.artist))
    } else if (sortBy === 'duration') {
      songs.sort((a, b) => {
        const getSeconds = (duration: string | null) => {
          if (!duration) return 0
          const parts = duration.split(':').map(Number)
          if (parts.length === 2) return parts[0] * 60 + parts[1]
          if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
          return 0
        }
        return getSeconds(a.duration) - getSeconds(b.duration)
      })
    } else if (sortBy === 'newest') {
      songs.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    } else if (sortBy === 'oldest') {
      songs.sort((a, b) => new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime())
    } else if (sortBy === 'likes') {
      songs.sort((a, b) => b.likes - a.likes)
    } else if (sortBy === 'downloads') {
      songs.sort((a, b) => b.downloads - a.downloads)
    } else if (sortBy === 'plays') {
      songs.sort((a, b) => b.plays - a.plays)
    }

    setFilteredSongs(songs)
  }, [allSongs, searchQuery, activeFilter, selectedGenres, sortBy])

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

  const refreshSongs = () => {
    fetchSongs(1, true)
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

  // Get cover image or fallback
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

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  // Format number with K/M suffix
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  // Mobile App-like Layout Components
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Audio element (hidden) */}
      <audio ref={audioRef} className="hidden" />

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
            <div className="flex items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="relative max-w-md flex-1">
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
              
              {/* Refresh Button */}
              <button
                onClick={refreshSongs}
                disabled={loading || updatingSongId !== null}
                className="ml-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
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
                  disabled={updatingSongId !== null}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-50 ${
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
                {allGenres.slice(0, 4).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    disabled={updatingSongId !== null}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap disabled:opacity-50 ${
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
                className="md:hidden p-2 bg-gray-800 rounded-lg ml-2 disabled:opacity-50"
                onClick={() => {
                  // Show sort options modal
                  const sortOptions = ['default', 'title', 'artist', 'duration', 'newest', 'oldest', 'likes', 'downloads', 'plays', 'popular']
                  const currentIndex = sortOptions.indexOf(sortBy)
                  const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length]
                  handleSortChange(nextSort)
                }}
                disabled={updatingSongId !== null}
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
                    { key: 'playlists', label: 'Playlists', icon: '📋' },
                    { key: 'popular', label: 'Popular', icon: '⭐' },
                    { key: 'most-played', label: 'Most Played', icon: '▶️' }
                  ].map((filter) => (
                    <button 
                      key={filter.key}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center disabled:opacity-50 ${
                        activeFilter === filter.key 
                          ? 'bg-purple-600' 
                          : 'bg-gray-800'
                      }`}
                      onClick={() => {
                        setActiveFilter(filter.key)
                        setShowFilters(false)
                      }}
                      disabled={updatingSongId !== null}
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
                      className={`px-3 py-1.5 rounded-full text-sm disabled:opacity-50 ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      onClick={() => toggleGenre(genre)}
                      disabled={updatingSongId !== null}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-sm mb-2">Sort By</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'default', label: 'Default' },
                    { key: 'title', label: 'Title' },
                    { key: 'artist', label: 'Artist' },
                    { key: 'newest', label: 'Newest' },
                    { key: 'oldest', label: 'Oldest' },
                    { key: 'duration', label: 'Duration' },
                    { key: 'likes', label: 'Likes' },
                    { key: 'downloads', label: 'Downloads' },
                    { key: 'plays', label: 'Plays' }
                  ].map((sortOption) => (
                    <button
                      key={sortOption.key}
                      className={`px-3 py-2 rounded-lg text-sm disabled:opacity-50 ${
                        sortBy === sortOption.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      onClick={() => {
                        handleSortChange(sortOption.key)
                        setShowFilters(false)
                      }}
                      disabled={updatingSongId !== null}
                    >
                      {sortOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm disabled:opacity-50"
                  disabled={updatingSongId !== null}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm disabled:opacity-50"
                  disabled={updatingSongId !== null}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white/60">Loading songs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Songs</h3>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm"
                onClick={() => fetchSongs(1, true)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredSongs.length > 0 && (
            <div className="mb-3 text-gray-400 text-sm">
              {searchQuery ? (
                <div className="flex items-center justify-between">
                  <span>{filteredSongs.length} results found</span>
                  <button
                    onClick={clearSearch}
                    className="text-purple-400 text-xs"
                    disabled={updatingSongId !== null}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{totalSongs} songs total • Showing {filteredSongs.length}</span>
                  <button
                    onClick={refreshSongs}
                    className="text-purple-400 text-xs flex items-center gap-1"
                    disabled={updatingSongId !== null || loading}
                  >
                    <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Songs List - Mobile App Style */}
          {!loading && !error && filteredSongs.length > 0 && (
            <div className={currentView === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
              {filteredSongs.map((song) => (
                <div 
                  key={song.id}
                  className={`group bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer ${
                    currentView === 'grid' ? 'p-3' : 'p-3'
                  } ${updatingSongId === song.id ? 'opacity-70' : ''}`}
                  onClick={() => console.log('Song selected:', song.id)}
                >
                  <div className={`flex items-center ${currentView === 'grid' ? 'flex-col text-center' : ''}`}>
                    {/* Album Cover - Mobile Optimized */}
                    <div className={`relative ${currentView === 'grid' ? 'mb-3' : 'mr-3'}`}>
                      <div 
                        className={`${
                          currentView === 'grid' 
                            ? 'w-full aspect-square' 
                            : 'w-12 h-12'
                        } rounded-lg flex items-center justify-center overflow-hidden ${
                          song.cover_url ? '' : `bg-gradient-to-br ${getSongCover(song)}`
                        }`}
                        style={song.cover_url ? { 
                          backgroundImage: `url("${song.cover_url}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        } : {}}
                      >
                        {!song.cover_url && (
                          <span className="text-white text-sm font-bold">
                            {getFirstLetter(song.title)}
                          </span>
                        )}
                      </div>
                      {/* Play/Pause Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlayPause(song.id, song.audio_url)
                        }}
                        disabled={updatingSongId !== null}
                        className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 ${
                          song.isPlaying ? 'opacity-100 bg-purple-600/60' : ''
                        }`}
                      >
                        {updatingSongId === song.id ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : song.isPlaying ? (
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
                        {song.is_explicit && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-300 text-xs rounded">E</span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        currentView === 'grid' ? 'flex-col gap-1' : ''
                      }`}>
                        {song.album && (
                          <p className="text-gray-500 text-xs truncate">{song.album}</p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-xs">{getSongDuration(song)}</span>
                          {song.genre && (
                            <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">
                              {song.genre}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interaction Stats - Desktop View */}
                      <div className="hidden md:flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(song.id)
                            }}
                            disabled={updatingSongId !== null}
                            className={`flex items-center space-x-1 disabled:opacity-50 ${song.userLiked ? 'text-purple-400' : 'text-gray-400 hover:text-purple-300'}`}
                            title="Like this song"
                          >
                            {updatingSongId === song.id ? (
                              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill={song.userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={song.userLiked ? 0 : 1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                            )}
                            <span>{formatCount(song.likes)}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDislike(song.id)
                            }}
                            disabled={updatingSongId !== null}
                            className={`flex items-center space-x-1 disabled:opacity-50 ${song.userDisliked ? 'text-red-400' : 'text-gray-400 hover:text-red-300'}`}
                            title="Dislike this song"
                          >
                            {updatingSongId === song.id ? (
                              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill={song.userDisliked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={song.userDisliked ? 0 : 1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                              </svg>
                            )}
                            <span>{formatCount(song.dislikes)}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(song.id, song.title, song.audio_url)
                            }}
                            disabled={updatingSongId !== null}
                            className="flex items-center space-x-1 text-gray-400 hover:text-green-300 disabled:opacity-50"
                            title="Download this song"
                          >
                            {updatingSongId === song.id ? (
                              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            <span>{formatCount(song.downloads)}</span>
                          </button>

                          <div className="flex items-center space-x-1 text-gray-500" title="Plays">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatCount(song.plays)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interaction Buttons - Mobile View */}
                    <div className="md:hidden flex flex-col items-center space-y-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(song.id)
                        }}
                        disabled={updatingSongId !== null}
                        className={`p-1.5 rounded-full disabled:opacity-50 ${song.userLiked ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}
                        title="Like"
                      >
                        {updatingSongId === song.id ? (
                          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill={song.userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={song.userLiked ? 0 : 1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        )}
                        <span className="text-xs block text-center mt-0.5">{formatCount(song.likes)}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlayPause(song.id, song.audio_url)
                        }}
                        disabled={updatingSongId !== null}
                        className={`p-1.5 rounded-full disabled:opacity-50 ${song.isPlaying ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        title={song.isPlaying ? "Pause" : "Play"}
                      >
                        {updatingSongId === song.id ? (
                          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : song.isPlaying ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(song.id, song.title, song.audio_url)
                        }}
                        disabled={updatingSongId !== null}
                        className="p-1.5 rounded-full bg-gray-800 text-gray-400 disabled:opacity-50"
                        title="Download"
                      >
                        {updatingSongId === song.id ? (
                          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        <span className="text-xs block text-center mt-0.5">{formatCount(song.downloads)}</span>
                      </button>
                    </div>

                    {/* More Options Button */}
                    <button 
                      className={`p-2 text-gray-400 hover:text-white disabled:opacity-50 ${
                        currentView === 'grid' ? 'absolute top-2 right-2' : 'ml-2'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        // Show action sheet with more options
                        console.log('Show more options for:', song.title)
                      }}
                      disabled={updatingSongId !== null}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-white/60 text-sm mt-2">Loading more songs...</p>
            </div>
          )}

          {/* No More Songs */}
          {!hasMore && !loading && !isLoadingMore && filteredSongs.length > 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No more songs to load</p>
            </div>
          )}

          {/* Empty State - Mobile App Style */}
          {!loading && !error && filteredSongs.length === 0 && (
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
                disabled={updatingSongId !== null}
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
          <button className="flex flex-col items-center p-2" onClick={() => window.location.href = '/'}>
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
          
          {/* Upload */}
          <button className="flex flex-col items-center p-2 -mt-4" onClick={() => window.location.href = '/upload'}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400 mt-1">Upload</span>
          </button>
          
          {/* Library */}
          <button className="flex flex-col items-center p-2" onClick={() => window.location.href = '/songs'}>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Library</span>
          </button>
          
          {/* Profile */}
          <button className="flex flex-col items-center p-2" onClick={() => window.location.href = '/profile'}>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </button>
        </div>
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