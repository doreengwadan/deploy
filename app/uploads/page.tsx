"use client"

import { useState, useEffect } from 'react'
import Header from '../../componets/Header'

interface UploadedSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  uploadDate: string;
  status: 'published' | 'processing' | 'draft';
  plays: number;
  likes: number;
  downloads: number;
}

export default function UploadsPage() {
  const [uploadedSongs, setUploadedSongs] = useState<UploadedSong[]>([
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'You',
      duration: '3:45',
      uploadDate: '2024-01-15',
      status: 'published',
      plays: 1245,
      likes: 87,
      downloads: 45
    },
    {
      id: '2',
      title: 'Summer Breeze',
      artist: 'You',
      duration: '4:20',
      uploadDate: '2024-01-10',
      status: 'published',
      plays: 892,
      likes: 64,
      downloads: 32
    },
    {
      id: '3',
      title: 'Urban Jungle',
      artist: 'You',
      duration: '3:15',
      uploadDate: '2024-01-05',
      status: 'processing',
      plays: 0,
      likes: 0,
      downloads: 0
    },
    {
      id: '4',
      title: 'Neon Lights',
      artist: 'You',
      duration: '5:10',
      uploadDate: '2023-12-28',
      status: 'draft',
      plays: 0,
      likes: 0,
      downloads: 0
    }
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUploadClick = () => {
    setIsUploading(true)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          const newSong: UploadedSong = {
            id: Date.now().toString(),
            title: 'New Track ' + (uploadedSongs.length + 1),
            artist: 'You',
            duration: '4:00',
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'processing',
            plays: 0,
            likes: 0,
            downloads: 0
          }
          setUploadedSongs([newSong, ...uploadedSongs])
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  const handleEdit = (id: string) => {
    alert(`Edit song ${id}`)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      setUploadedSongs(uploadedSongs.filter(song => song.id !== id))
    }
  }

  const getStatusColor = (status: UploadedSong['status']) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400'
      case 'processing': return 'bg-yellow-500/20 text-yellow-400'
      case 'draft': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">My Uploads</h1>
                <p className="text-white/70 text-sm md:text-base">Manage and track your uploaded songs</p>
              </div>
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 justify-center md:justify-start text-sm md:text-base"
              >
                {isUploading ? (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading... {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload New Song</span>
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-white/5 rounded-xl p-3 md:p-6">
                <div className="text-lg md:text-2xl font-bold text-purple-400">{uploadedSongs.length}</div>
                <div className="text-white/70 text-xs md:text-sm">Total Songs</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-6">
                <div className="text-lg md:text-2xl font-bold text-green-400">
                  {uploadedSongs.reduce((sum, song) => sum + song.plays, 0).toLocaleString()}
                </div>
                <div className="text-white/70 text-xs md:text-sm">Total Plays</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-6">
                <div className="text-lg md:text-2xl font-bold text-pink-400">
                  {uploadedSongs.reduce((sum, song) => sum + song.likes, 0)}
                </div>
                <div className="text-white/70 text-xs md:text-sm">Total Likes</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 md:p-6">
                <div className="text-lg md:text-2xl font-bold text-blue-400">
                  {uploadedSongs.reduce((sum, song) => sum + song.downloads, 0)}
                </div>
                <div className="text-white/70 text-xs md:text-sm">Total Downloads</div>
              </div>
            </div>
          </div>

          {/* Uploads Table */}
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-white/10">
              <h2 className="text-xl md:text-2xl font-bold">Your Songs</h2>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 font-medium">Title</th>
                    <th className="text-left p-4 text-white/60 font-medium">Status</th>
                    <th className="text-left p-4 text-white/60 font-medium">Upload Date</th>
                    <th className="text-left p-4 text-white/60 font-medium">Plays</th>
                    <th className="text-left p-4 text-white/60 font-medium">Likes</th>
                    <th className="text-left p-4 text-white/60 font-medium">Downloads</th>
                    <th className="text-left p-4 text-white/60 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedSongs.map((song) => (
                    <tr key={song.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{song.title}</div>
                          <div className="text-white/60 text-sm">{song.artist} • {song.duration}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(song.status)}`}>
                          {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-white/70">{song.uploadDate}</td>
                      <td className="p-4">
                        <div className="font-medium">{song.plays.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{song.likes}</span>
                          <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{song.downloads}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(song.id)}
                            className="text-white/70 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(song.id)}
                            className="text-white/70 hover:text-red-400 p-1 md:p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/10">
              {uploadedSongs.map((song) => (
                <div key={song.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-base">{song.title}</h3>
                      <p className="text-white/60 text-sm truncate">{song.artist} • {song.duration}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(song.status)}`}>
                      {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <div className="font-medium text-green-400">{song.plays.toLocaleString()}</div>
                      <div className="text-white/60 text-xs">Plays</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-pink-400 flex items-center justify-center space-x-1">
                        <span>{song.likes}</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <div className="text-white/60 text-xs">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-400">{song.downloads}</div>
                      <div className="text-white/60 text-xs">Downloads</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">Uploaded: {song.uploadDate}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(song.id)}
                        className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="text-white/70 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {uploadedSongs.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 md:w-16 md:h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">No Uploads Yet</h3>
                <p className="text-white/70 mb-4 md:mb-8 text-sm md:text-base">Upload your first song to get started</p>
                <button
                  onClick={handleUploadClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base"
                >
                  Upload Your First Song
                </button>
              </div>
            )}
          </div>

          {/* Upload Guidelines */}
          <div className="mt-6 md:mt-8 bg-white/5 rounded-2xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Upload Guidelines</h3>
            <ul className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
              <li className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Supported formats: MP3, WAV, FLAC, AAC (Max 50MB)</span>
              </li>
              <li className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Add high-quality album art (min 300x300px, max 5MB)</span>
              </li>
              <li className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ensure you have the rights to upload the content</span>
              </li>
              <li className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Processing may take 5-10 minutes after upload</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}