"use client"

import { useState, useRef } from 'react'
import Header from '../../componets/Header'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [dragActive, setDragActive] = useState(false)
  
  // Song details form state
  const [songDetails, setSongDetails] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    description: '',
    isExplicit: false,
    isPublic: true
  })

  // File input refs
  const audioFileRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)
  const lyricsFileRef = useRef<HTMLInputElement>(null)

  // Selected files state
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const [selectedCover, setSelectedCover] = useState<File | null>(null)
  const [selectedLyrics, setSelectedLyrics] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        handleAudioSelect(file)
      }
    }
  }

  // Handle audio file selection
  const handleAudioSelect = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, etc.)')
      return
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size too large. Maximum size is 50MB')
      return
    }
    
    setSelectedAudio(file)
    
    // Generate song title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
    setSongDetails(prev => ({
      ...prev,
      title: prev.title || fileName,
      artist: prev.artist || 'Unknown Artist'
    }))
  }

  // Handle cover image selection
  const handleCoverSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, etc.)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size too large. Maximum size is 5MB')
      return
    }
    
    setSelectedCover(file)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setCoverPreview(previewUrl)
  }

  // Handle lyrics file selection
  const handleLyricsSelect = (file: File) => {
    if (!file.type.endsWith('.txt') && !file.type.endsWith('.lrc')) {
      alert('Please select a lyrics file (.txt or .lrc)')
      return
    }
    
    setSelectedLyrics(file)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setSongDetails(prev => ({ ...prev, [name]: checked }))
    } else {
      setSongDetails(prev => ({ ...prev, [name]: value }))
    }
  }

  // Simulate upload progress
  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          // Add to uploaded files
          const newFile = {
            id: Date.now(),
            name: selectedAudio?.name || 'Unknown',
            size: selectedAudio?.size || 0,
            date: new Date().toISOString(),
            status: 'completed'
          }
          setUploadedFiles(prev => [newFile, ...prev])
          
          // Reset form after successful upload
          setTimeout(() => {
            resetForm()
            alert('Upload successful! Your song is now being processed.')
          }, 500)
          
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!selectedAudio) {
      alert('Please select an audio file to upload')
      return
    }
    
    if (!songDetails.title.trim()) {
      alert('Please enter a song title')
      return
    }
    
    if (!songDetails.artist.trim()) {
      alert('Please enter an artist name')
      return
    }
    
    // Start upload simulation
    simulateUpload()
  }

  // Reset form
  const resetForm = () => {
    setSelectedAudio(null)
    setSelectedCover(null)
    setSelectedLyrics(null)
    setCoverPreview(null)
    setSongDetails({
      title: '',
      artist: '',
      album: '',
      genre: '',
      releaseDate: '',
      description: '',
      isExplicit: false,
      isPublic: true
    })
    setUploadProgress(0)
    
    // Clear file inputs
    if (audioFileRef.current) audioFileRef.current.value = ''
    if (coverImageRef.current) coverImageRef.current.value = ''
    if (lyricsFileRef.current) lyricsFileRef.current.value = ''
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Genre options
  const genreOptions = [
    'Electronic', 'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical',
    'Country', 'Reggae', 'Metal', 'Folk', 'Blues', 'World', 'Ambient',
    'Synthwave', 'Indie', 'Alternative', 'Dance', 'House', 'Techno'
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile App Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button 
              className="p-2"
              onClick={() => router.back()}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold">Upload Music</h1>

            {/* Upload Button */}
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUploading 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Main Content */}
      <main className={`pt-16 md:pt-0 pb-20 md:pb-6`}>
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload Your Music</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Share your music with the world. Upload high-quality audio files with album art and lyrics.
            </p>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mb-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Please keep this page open until upload is complete.
              </p>
            </div>
          )}

          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - File Upload */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio File Upload */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Audio File
                </h2>
                
                {selectedAudio ? (
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{selectedAudio.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(selectedAudio.size)} • {selectedAudio.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAudio(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-300 mb-2">Drop your audio file here</p>
                    <p className="text-gray-500 text-sm mb-4">MP3, WAV, FLAC up to 50MB</p>
                    <button
                      onClick={() => audioFileRef.current?.click()}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                    >
                      Browse Files
                    </button>
                    <input
                      ref={audioFileRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleAudioSelect(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              {/* Cover Art Upload */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Cover Art (Optional)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cover Preview */}
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {coverPreview ? (
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm">No cover art</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div>
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-3">Recommended: 1000x1000px JPG or PNG</p>
                      {selectedCover ? (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{selectedCover.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(selectedCover.size)}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCover(null)
                                setCoverPreview(null)
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => coverImageRef.current?.click()}
                          className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                        >
                          Upload Cover Art
                        </button>
                      )}
                      <input
                        ref={coverImageRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
                      />
                    </div>
                    
                    {/* Lyrics Upload */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Lyrics File (Optional)</h3>
                      {selectedLyrics ? (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{selectedLyrics.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(selectedLyrics.size)}</p>
                            </div>
                            <button
                              onClick={() => setSelectedLyrics(null)}
                              className="text-gray-400 hover:text-white"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => lyricsFileRef.current?.click()}
                          className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                        >
                          Upload Lyrics (.txt or .lrc)
                        </button>
                      )}
                      <input
                        ref={lyricsFileRef}
                        type="file"
                        accept=".txt,.lrc"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleLyricsSelect(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Song Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 sticky top-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Song Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={songDetails.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                      placeholder="Song title"
                      required
                    />
                  </div>

                  {/* Artist */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Artist *</label>
                    <input
                      type="text"
                      name="artist"
                      value={songDetails.artist}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                      placeholder="Artist name"
                      required
                    />
                  </div>

                  {/* Album */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Album (Optional)</label>
                    <input
                      type="text"
                      name="album"
                      value={songDetails.album}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                      placeholder="Album name"
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Genre</label>
                    <select
                      name="genre"
                      value={songDetails.genre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm appearance-none"
                    >
                      <option value="">Select genre</option>
                      {genreOptions.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Release Date</label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={songDetails.releaseDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={songDetails.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm resize-none"
                      placeholder="Tell listeners about this track..."
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isExplicit"
                        checked={songDetails.isExplicit}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm">Contains explicit content</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={songDetails.isPublic}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm">Make this track public</span>
                    </label>
                  </div>

                  {/* Upload Requirements */}
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-medium mb-2">Requirements</h3>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className="flex items-center">
                        <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Audio file required (MP3, WAV, FLAC)
                      </li>
                      <li className="flex items-center">
                        <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Max file size: 50MB
                      </li>
                      <li className="flex items-center">
                        <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Title and artist required
                      </li>
                    </ul>
                  </div>

                  {/* Desktop Upload Button */}
                  <div className="hidden md:block pt-4">
                    <button
                      type="submit"
                      disabled={isUploading || !selectedAudio}
                      className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                        isUploading
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : selectedAudio
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Song'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-4 text-sm font-medium text-gray-400">File</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Size</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm">{file.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-400">{formatFileSize(file.size)}</td>
                          <td className="p-4 text-sm text-gray-400">
                            {new Date(file.date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </button>
          
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Browse</span>
          </button>
          
          <button className="flex flex-col items-center p-2 -mt-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400 mt-1">Play</span>
          </button>
          
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs text-purple-400 mt-1">Upload</span>
          </button>
          
          <button className="flex flex-col items-center p-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}