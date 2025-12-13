'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [uploadError, setUploadError] = useState('')

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

  // Initialize on client only
  useEffect(() => {
    setIsMounted(true)
    
    // Clean up preview URLs on unmount
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [])

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
      setUploadError('Please select an audio file (MP3, WAV, etc.)')
      return
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size too large. Maximum size is 50MB')
      return
    }
    
    setSelectedAudio(file)
    setUploadError('')
    
    // Generate song title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, "")
    setSongDetails(prev => ({
      ...prev,
      title: prev.title || fileName,
      artist: prev.artist || 'Unknown Artist'
    }))
  }

  // Handle cover image selection
  const handleCoverSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, etc.)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size too large. Maximum size is 5MB')
      return
    }
    
    // Clean up previous preview URL
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    
    setSelectedCover(file)
    setUploadError('')
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setCoverPreview(previewUrl)
  }

  // Handle lyrics file selection
  const handleLyricsSelect = (file: File) => {
    const validTypes = ['text/plain', 'application/lrc', 'application/x-subrip']
    const validExtensions = ['.txt', '.lrc']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension) && !validTypes.includes(file.type)) {
      setUploadError('Please select a lyrics file (.txt or .lrc)')
      return
    }
    
    setSelectedLyrics(file)
    setUploadError('')
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

  // Validate form
  const validateForm = () => {
    if (!selectedAudio) {
      setUploadError('Please select an audio file to upload')
      return false
    }
    
    if (!songDetails.title.trim()) {
      setUploadError('Please enter a song title')
      return false
    }
    
    if (!songDetails.artist.trim()) {
      setUploadError('Please enter an artist name')
      return false
    }
    
    return true
  }

  // Handle form submission - FIXED VERSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError('')
    
    if (!validateForm()) {
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      
      // Add form fields
      formData.append('title', songDetails.title)
      formData.append('artist', songDetails.artist)
      formData.append('album', songDetails.album)
      formData.append('genre', songDetails.genre)
      formData.append('releaseDate', songDetails.releaseDate)
      formData.append('description', songDetails.description)
      formData.append('isExplicit', songDetails.isExplicit.toString())
      formData.append('isPublic', songDetails.isPublic.toString())
      
      // Add files
      if (selectedAudio) {
        formData.append('audioFile', selectedAudio)
        console.log('Adding audio file:', selectedAudio.name, selectedAudio.size, 'bytes')
      }
      if (selectedCover) {
        formData.append('coverFile', selectedCover)
        console.log('Adding cover file:', selectedCover.name)
      }
      if (selectedLyrics) {
        formData.append('lyricsFile', selectedLyrics)
        console.log('Adding lyrics file:', selectedLyrics.name)
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)
      
      console.log('Submitting form to /api/upload...')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      console.log('Response status:', response.status, response.statusText)
      
      // Try to parse JSON response
      let data
      let responseText = ''
      
      try {
        responseText = await response.text()
        console.log('Response text:', responseText)
        
        if (responseText) {
          data = JSON.parse(responseText)
          console.log('Parsed response data:', data)
        } else {
          console.error('Empty response from server')
          throw new Error('Server returned empty response')
        }
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError)
        console.error('Response text that failed to parse:', responseText)
        
      }
      
      if (!response.ok) {
        console.error('API Error response:', data)
        throw new Error(data?.error || data?.message || `Upload failed (Status: ${response.status})`)
      }
      
      if (!data.success) {
        throw new Error(data.error || data.message || 'Upload failed')
      }
      
      setUploadSuccess(data.message || 'Upload successful! Your song is now available.')
      
      // Reset form after delay
      setTimeout(() => {
        resetForm()
        setUploadSuccess('')
        setUploadProgress(0)
        
        // Optional: Redirect to songs page after success
        // setTimeout(() => {
        //   router.push('/songs')
        // }, 1000)
      }, 3000)
      
    } catch (err) {
      console.error('Upload error:', err)
      
      if (err instanceof Error) {
        // Show more detailed error
        if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          setUploadError('Network error. Check your connection and try again.')
        } else if (err.message.includes('JSON')) {
          setUploadError('Server error. Please check if the API is running.')
        } else {
          setUploadError(err.message || 'Upload failed. Please try again.')
        }
      } else {
        setUploadError('Upload failed. Please try again.')
      }
      
      // Reset progress on error
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setSelectedAudio(null)
    setSelectedCover(null)
    setSelectedLyrics(null)
    
    // Clean up preview URL
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
      setCoverPreview(null)
    }
    
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

  // Don't render until client-side mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading upload form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
        <div className="absolute inset-0 bg-noise opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-6 px-6">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="text-white text-2xl font-bold">Mayembe @Music</span>
        </Link>
      </header>

      <main className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Upload Your Music</h1>
            <p className="text-white/70 text-lg">
              Share your music with the world. Upload high-quality audio files with album art and lyrics.
            </p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{uploadSuccess}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{uploadError}</span>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Uploading {selectedAudio?.name}</h3>
                    <p className="text-white/60 text-sm">{uploadProgress}% complete</p>
                  </div>
                </div>
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-white/50 text-sm mt-3">
                Please keep this page open until upload is complete.
              </p>
            </div>
          )}

         
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - File Upload */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio File Upload */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Audio File</h2>
                      <p className="text-white/60 text-sm">MP3, WAV, FLAC up to 50MB</p>
                    </div>
                  </div>
                  {selectedAudio && (
                    <button
                      onClick={() => setSelectedAudio(null)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {selectedAudio ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">{selectedAudio.name}</p>
                          <p className="text-white/60 text-sm">
                            {formatFileSize(selectedAudio.size)} • {selectedAudio.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-white/20 hover:border-white/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-xl text-white mb-2">Drop your audio file here</p>
                    <p className="text-white/60 mb-6">MP3, WAV, FLAC up to 50MB</p>
                    <button
                      onClick={() => audioFileRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
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

              {/* Cover Art & Lyrics */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cover Art & Lyrics</h2>
                    <p className="text-white/60 text-sm">Optional but recommended</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cover Preview */}
                  <div className="aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    {coverPreview ? (
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6">
                        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-white/40 text-center">No cover art uploaded</p>
                        <p className="text-white/30 text-sm mt-2">1000×1000px recommended</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-6">
                    {/* Cover Upload */}
                    <div>
                      <h3 className="text-white font-medium mb-3">Cover Art</h3>
                      {selectedCover ? (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className="font-medium text-white text-sm">{selectedCover.name}</p>
                                <p className="text-white/60 text-xs">{formatFileSize(selectedCover.size)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCover(null)
                                if (coverPreview) {
                                  URL.revokeObjectURL(coverPreview)
                                  setCoverPreview(null)
                                }
                              }}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => coverImageRef.current?.click()}
                          className="w-full py-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white hover:text-white transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <svg className="w-8 h-8 text-white/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm">Upload Cover Image</span>
                          <span className="text-xs text-white/40 mt-1">JPG, PNG up to 5MB</span>
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
                      <h3 className="text-white font-medium mb-3">Lyrics File (Optional)</h3>
                      {selectedLyrics ? (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className="font-medium text-white text-sm">{selectedLyrics.name}</p>
                                <p className="text-white/60 text-xs">{formatFileSize(selectedLyrics.size)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedLyrics(null)}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => lyricsFileRef.current?.click()}
                          className="w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm">Upload Lyrics File</span>
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
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Song Details</h2>
                    <p className="text-white/60 text-sm">Tell us about your track</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={songDetails.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Song title"
                      required
                    />
                  </div>

                  {/* Artist */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Artist *</label>
                    <input
                      type="text"
                      name="artist"
                      value={songDetails.artist}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Artist name"
                      required
                    />
                  </div>

                  {/* Album */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Album (Optional)</label>
                    <input
                      type="text"
                      name="album"
                      value={songDetails.album}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Album name"
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Genre</label>
                    <select
                      name="genre"
                      value={songDetails.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none"
                    >
                      <option value="">Select genre</option>
                      {genreOptions.map(genre => (
                        <option key={genre} value={genre} className="bg-slate-900">{genre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Release Date</label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={songDetails.releaseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={songDetails.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell listeners about this track..."
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isExplicit"
                          checked={songDetails.isExplicit}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-all duration-300 ${songDetails.isExplicit ? 'bg-purple-500' : 'bg-white/10'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 transform ${songDetails.isExplicit ? 'left-5' : 'left-1'}`}></div>
                        </div>
                      </div>
                      <span className="text-white text-sm">Contains explicit content</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={songDetails.isPublic}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-all duration-300 ${songDetails.isPublic ? 'bg-purple-500' : 'bg-white/10'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 transform ${songDetails.isPublic ? 'left-5' : 'left-1'}`}></div>
                        </div>
                      </div>
                      <span className="text-white text-sm">Make this track public</span>
                    </label>
                  </div>

                  {/* Upload Button */}
                  <div className="pt-6 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isUploading || !selectedAudio}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                        isUploading
                          ? 'bg-white/10 text-white/40 cursor-not-allowed'
                          : selectedAudio
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      } flex items-center justify-center space-x-2`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Uploading... {uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                          <span>Upload Song</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isUploading}
                      className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>

                {/* Requirements */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-white/60">
                      <svg className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Audio file required (MP3, WAV, FLAC)
                    </li>
                    <li className="flex items-center text-sm text-white/60">
                      <svg className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Max file size: 50MB
                    </li>
                    <li className="flex items-center text-sm text-white/60">
                      <svg className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Title and artist required
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Background Music Note Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/5 animate-float"
            style={{
              left: `${10 + i * 10}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 5}s`
            }}
          >
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}