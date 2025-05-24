import React from 'react'
import UrlForm from '../components/UrlForm'
import UserUrl from '../components/UserUrl'

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col gap-8" style={{ minHeight: '80vh' }}>
        <h1 className="text-2xl font-bold text-center">URL Shortener</h1>
        <div>
          <UrlForm />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <UserUrl />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage