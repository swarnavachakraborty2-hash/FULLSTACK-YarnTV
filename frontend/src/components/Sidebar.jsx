import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  TweetIcon
} from './Icons'

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Mini sidebar items (shown on the left column under the menu)
  const miniNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'tweets', label: 'Tweets', icon: TweetIcon, path: '/feed/tweets' },
    { id: 'you', label: 'You', icon: YouIcon, path: '/profile' }
  ]

  // Full drawer items
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'you', label: 'You', icon: YouIcon, path: '/profile' },
    { id: 'tweets', label: 'Tweets', icon: TweetIcon, path: '/feed/tweets' },
    { id: 'liked', label: 'Liked Videos', icon: LikeIcon, path: '/liked' },
    { id: 'history', label: 'History', icon: HistoryIcon, path: '/history' },
    { id: 'content', label: 'My Channel', icon: YouIcon, path: '/channel' },
    { id: 'collections', label: 'Collections', icon: FolderIcon, path: '/collections' },
  ]

  const bottomNavItems = [
    { id: 'support', label: 'Support', icon: SupportIcon, path: '/support' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ]

  const handleNavigation = (path) => {
    navigate(path)
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
              <span className="mini-sidebar-label">{item.label}</span>
            </button>
          )
        })}
      </aside>

      {/* Full Sliding Drawer Sidebar (Appears when ☰ menu is clicked) */}
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
    </>
  )
}

export default Sidebar
