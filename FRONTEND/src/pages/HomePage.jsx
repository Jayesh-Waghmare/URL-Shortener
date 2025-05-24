import React from 'react'
import UrlForm from '../components/UrlForm'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Shorten Your URLs with Ease
            </h1>
            <p className="text-lg text-gray-600">
              Create short, memorable links that are perfect for sharing
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <UrlForm />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-blue-600 text-2xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Simple</h3>
              <p className="text-gray-600">Create short URLs in seconds with our easy-to-use interface</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-blue-600 text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Analytics</h3>
              <p className="text-gray-600">Monitor clicks and engagement with detailed analytics</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-blue-600 text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Links</h3>
              <p className="text-gray-600">Your links are protected with industry-standard security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage