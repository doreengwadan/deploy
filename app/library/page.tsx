"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../componets/Header'

interface Playlist {
  id: string;
  title: string;
  description: string;
  songCount: number;
  image: string;
  color: string;
  lastPlayed: string;
}

interface LikedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  likedAt: string;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'albums' | 'artists'>('playlists')
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      title: 'Chill Vibes',
      description: 'Relaxing beats for focused work',
      songCount: 24,
      image: '',
      color: 'from-blue-500 to-teal-500',
      lastPlayed: 'Yesterday'
    },
    {
      id: '2',
      title: 'Workout Pump',
      description: 'High energy tracks for your workout',
      songCount: 18,
      image: '',
      color: 'from-red-500 to-orange-500',
      lastPlayed: '2 days ago'
    },
    {
      id: '3',
      title: 'Study Focus',
      description: 'Instrumental music for concentration',
      songCount: 32,
      image: '',
      color: 'from-green-500 to-emerald-500',
      lastPlayed: '1 week ago'
    },
    {
      id: '4',
      title: 'Party Mix',
      description: 'Latest hits for celebrations',
      songCount: 45,
      image: '',
      color: 'from-purple-500 to-pink-500',
      lastPlayed: '3 days ago'
    }
  ])

  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([
    {
      id: '1',
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      duration: '4:04',
      likedAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:22',
      likedAt: '1 day ago'
    },
    {
      id: '3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: '5:55',
      likedAt: '3 days ago'
    },
    {
      id: '4',
      title: 'Take on Me',
      artist: 'a-ha',
      album: 'Hunting High and Low',
      duration: '3:48',
      likedAt: '1 week ago'
    }
  ])

  const handleCreatePlaylist = () => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: 'New Playlist ' + (playlists.length + 1),
      description: 'Your new playlist',
      songCount: 0,
      image: '',
      color: `from-${['purple', 'blue', 'green', 'red', 'pink'][playlists.length % 5]}-500 to-${['pink', 'teal', 'emerald', 'orange', 'purple'][playlists.length % 5]}-500`,
      lastPlayed: 'Never'
    }
    setPlaylists([...playlists, newPlaylist])
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
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Your Library</h1>
                <p className="text-white/70 text-sm md:text-base">Manage your playlists, liked songs, and collections</p>
              </div>
              <button
                onClick={handleCreatePlaylist}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 justify-center md:justify-start text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Playlist</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 md:space-x-4 border-b border-white/10 overflow-x-auto">
              {(['playlists', 'liked', 'albums', 'artists'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 md:pb-4 px-2 md:px-4 font-medium capitalize transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab === 'liked' ? 'Liked Songs' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'playlists' && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your Playlists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 md:p-6 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={`w-full h-32 md:h-40 rounded-xl bg-gradient-to-br ${playlist.color} mb-3 md:mb-4 flex items-center justify-center`}>
                      {playlist.image ? (
                        <img src={playlist.image} alt={playlist.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="text-white/90 text-2xl md:text-4xl font-bold">
                          {playlist.title.split(' ').map(w => w[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-purple-400 transition-colors truncate">
                      {playlist.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4 truncate">{playlist.description}</p>
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-white/70 truncate">{playlist.songCount} songs</span>
                      <span className="text-white/50 truncate ml-2">Played: {playlist.lastPlayed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'liked' && (
            <div>
              <div className="mb-6 md:mb-8 p-4 md:p-8 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Liked Songs</h2>
                    <p className="text-white/80 text-sm md:text-lg mb-2 md:mb-4">Your personal collection of favorite tracks</p>
                    <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm">
                      <span className="text-white/70">{likedSongs.length} songs</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/70">4 hr 45 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-3">Album</div>
                    <div className="col-span-2">Liked</div>
                    <div className="col-span-1 text-right">Duration</div>
                  </div>
                  <div className="divide-y divide-white/10">
                    {likedSongs.map((song, index) => (
                      <div key={song.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors group">
                        <div className="col-span-1 flex items-center">
                          <span className="text-white/60 group-hover:hidden">{index + 1}</span>
                          <button className="hidden group-hover:block text-white hover:text-purple-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                        <div className="col-span-5 flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded"></div>
                          <div className="min-w-0">
                            <h4 className="font-medium group-hover:text-purple-400 transition-colors truncate">{song.title}</h4>
                            <p className="text-white/60 text-sm truncate">{song.artist}</p>
                          </div>
                        </div>
                        <div className="col-span-3 flex items-center text-white/70 truncate">{song.album}</div>
                        <div className="col-span-2 flex items-center text-white/60 text-sm truncate">{song.likedAt}</div>
                        <div className="col-span-1 flex items-center justify-end">
                          <div className="text-white/60">{song.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile List */}
                <div className="md:hidden divide-y divide-white/10">
                  {likedSongs.map((song, index) => (
                    <div key={song.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white/60 text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium truncate">{song.title}</h4>
                            <span className="text-white/60 text-xs ml-2 flex-shrink-0">{song.duration}</span>
                          </div>
                          <p className="text-white/60 text-xs truncate mb-1">{song.artist}</p>
                          <p className="text-white/50 text-xs truncate mb-2">{song.album}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white/40 text-xs">Liked {song.likedAt}</span>
                            <button className="text-white/40 hover:text-white">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="text-center py-8 md:py-12">
              <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 md:w-16 md:h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">No Albums Yet</h3>
              <p className="text-white/70 mb-4 md:mb-8 text-sm md:text-base">Albums you save will appear here</p>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base">
                Browse Albums
              </button>
            </div>
          )}

          {activeTab === 'artists' && (
            <div className="text-center py-8 md:py-12">
              <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 md:w-16 md:h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Follow Your Favorite Artists</h3>
              <p className="text-white/70 mb-4 md:mb-8 text-sm md:text-base">Artists you follow will appear here</p>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base">
                Discover Artists
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}