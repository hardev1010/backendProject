import React from 'react'
import {FaSearch, FaBell, FaUserCircle} from 'react-icons/fa'

function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">VideoTube</h1>
      </div>
      <div className="flex-1 mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl cursor-pointer" />
        <FaUserCircle className="text-2xl cursor-pointer" />
      </div>
    </header>
  )
}

export default Header
