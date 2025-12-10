export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-center">
          About Khedman Music
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Story</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Khedman Music is a modern music streaming platform designed for music lovers 
              who want to discover, share, and enjoy their favorite tunes in a seamless experience.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Founded in 2024, our mission is to connect artists with listeners through 
              high-quality audio streaming and personalized recommendations.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Features</h2>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>High-quality audio streaming</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Personalized playlists</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Artist discovery</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Offline listening</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Music Director', 'Lead Developer', 'UX Designer'].map((role, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Team Member {index + 1}</h3>
                <p className="text-gray-400">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
