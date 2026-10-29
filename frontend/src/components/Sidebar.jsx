import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api, { apiCall } from '../api/axios'
import GuestLoginCard from './GuestLoginCard'
import {
  HomeIcon,
  LikeIcon,
  HistoryIcon,
  VideoCameraIcon,
  FolderIcon,
  SupportIcon,
  SettingsIcon,
  CloseIcon,
  PlayLogo,
  YouIcon,
  TweetIcon,
  BarChartIcon
} from './Icons'

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currUser, setCurrUser] = useState(null)
  const [showLoginCard, setShowLoginCard] = useState(false)

  useEffect(() => {
    apiCall(() => api.get("user/curr-user")
      .then((res) => {
        if (res.data) {
          setCurrUser(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
        setCurrUser(null)
      }))
  }, [])

  const exists = Boolean(currUser?._id)

  // Mini sidebar items (shown on the left column under the menu)
  const miniNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'tweets', label: 'Tweets', icon: TweetIcon, path: '/feed/tweets' },
    { id: 'you', label: 'You', icon: YouIcon, path: '/profile' },
    { id: 'admin', label: 'Admin Stats', miniLabel: <>Admin<br />Stats</>, icon: BarChartIcon, path: '/admin' }
  ]

  // Full drawer items
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'you', label: 'You', icon: YouIcon, path: '/profile' },
    { id: 'tweets', label: 'Tweets', icon: TweetIcon, path: '/feed/tweets' },
    { id: 'liked', label: 'Liked Videos', icon: LikeIcon, path: '/liked' },
    { id: 'history', label: 'History', icon: HistoryIcon, path: '/history' },
    { id: 'content', label: 'My Channel', icon: YouIcon, path: '/channel' },
    { id: 'admin', label: 'Admin Statistics', icon: BarChartIcon, path: '/admin' },
  ]

  const bottomNavItems = [
    { id: 'support', label: 'Support', icon: SupportIcon, path: '/support' },
  ]

  const handleNavigation = (path) => {
    // Protected paths that require user ID
    const protectedPaths = [
      '/profile',
      '/liked',
      '/history',
      '/channel',
      '/admin',
      '/feed/tweets'
    ]
    const isProtected = protectedPaths.includes(path)

    if (isProtected && !exists) {
      setShowLoginCard(true)
    } else {
      navigate(path)
    }

    if (onClose) onClose()
  }

  return (
    <>
      {/* Compact Mini Sidebar (Below the hamburger menu, YouTube-style) */}
      <aside className="mini-sidebar">
        {miniNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.id}
              type="button"
              className={`mini-sidebar-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              <Icon className="mini-sidebar-icon" />
              <span className="mini-sidebar-label">{item.miniLabel || item.label}</span>
            </button>
          )
        })}
      </aside>

      {/* Full Sliding Drawer Sidebar (Appears when menu is clicked) */}
      <aside className={`sidebar-drawer ${isOpen ? 'open' : 'closed'}`}>
        {/* Drawer Header with Close Button */}
        <div className="sidebar-header">
          <div className="sidebar-brand-mini" onClick={() => handleNavigation('/')}>
            <PlayLogo className="brand-logo-sm" />
            <span className="brand-name-mini">PLAY</span>
          </div>
          <button
            type="button"
            className="btn-close-sidebar"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon className="close-icon" />
          </button>
        </div>

        {/* Top Main Navigation */}
        <nav className="sidebar-nav">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-link ${isActive ? 'active' : ''} ${item.id === 'you' ? 'sidebar-link-you' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Settings & Support Navigation */}
        <div className="sidebar-bottom">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Guest Login / Register Card Modal */}
      {showLoginCard && (
        <GuestLoginCard onClose={() => setShowLoginCard(false)} />
      )}
    </>
  )
}

export default Sidebar
