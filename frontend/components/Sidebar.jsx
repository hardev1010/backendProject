import React from 'react'
import {FaHome, FaCompass, FaPlayCircle} from 'react-icons/fa'

function Sidebar() {
  return (
    <aside className="w-fit min-h-fit shadow-md hidden md:block">
        <nav className="p-4">
            <ul className="space-y-4">
                <li className="flex items-centre space-x-4 cursor-pointer p-2 hover:bg-gray-100 rounded-md">
                    <FaHome className="text-xl" />
                    <span className="text-lg">Home</span>
                </li>
                <li className="flex items-centre space-x-4 cursor-pointer p-2 hover:bg-gray-100 rounded-md">
                    <FaCompass className="text-xl" />
                    <span className="text-lg">Explore</span>
                </li>
                <li className="flex items-centre space-x-4 cursor-pointer p-2 hover:bg-gray-100 rounded-md">
                    <FaPlayCircle className="text-xl" />
                    <span className="text-lg">Your Videos</span>
                </li>
            </ul>
        </nav>
    </aside>
  )
}

export default Sidebar