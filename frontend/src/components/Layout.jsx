import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="app-container">
      {/* Top Navbar persistent across all pages */}
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="main-layout">
        {/* Backdrop overlay when sidebar drawer is open */}
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sliding Sidebar drawer that appears when menu is clicked */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Dynamic page content renders in full width */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
