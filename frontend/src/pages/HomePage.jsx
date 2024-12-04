import React from 'react'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <div className="flex">
        <Sidebar/>
        <main className="flex-1 p-4">
            
        </main>
      </div>
    </div>
  )
}

export default HomePage
