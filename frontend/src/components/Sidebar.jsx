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
  InfoIcon,
  YarnTVLogo,
  CloseIcon,
  PlayLogo,
  YouIcon,
  TweetIcon,
  BarChartIcon,
  PlusIcon,
  LogoutIcon
} from './Icons'

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currUser, setCurrUser] = useState(null)
  const [showLoginCard, setShowLoginCard] = useState(false)
  const [showMobileCreate, setShowMobileCreate] = useState(false)

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

  // Mini sidebar items (shown on the left column on desktop, and bottom bar on mobile)
  // 'you' is placed last so it appears on the right side of the bottom navigation bar on mobile
  const miniNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'tweets', label: 'Tweets', icon: TweetIcon, path: '/feed/tweets' },
    { id: 'admin', label: 'Stats', miniLabel: <>Admin<br />Stats</>, icon: BarChartIcon, path: '/admin' },
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
    { id: 'admin', label: 'Admin Statistics', icon: BarChartIcon, path: '/admin' },
  ]

  const bottomNavItems = [
    { id: 'info', label: 'Info & About', icon: InfoIcon, path: '/info' },
  ]

  const handleLogout = () => {
    apiCall(() => api.get("/user/logout")
      .then(() => {
        setCurrUser(null)
        navigate("/login")
      })
      .catch((err) => {
        console.log(err.response?.data?.message)
      }))
  }

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
      {/* Compact Mini Sidebar (Below menu button on desktop, fixed bottom navigation bar on mobile) */}
      <aside className="mini-sidebar">
        {miniNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.id}
              type="button"
              className={`mini-sidebar-btn ${isActive ? 'active' : ''} ${item.id === 'you' ? 'mini-sidebar-btn-you' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              {item.id === 'you' && currUser?.avatar ? (
                <img
                  src={currUser.avatar}
                  alt={currUser.username || 'Profile'}
                  className="mini-sidebar-avatar"
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block' }}
                />
              ) : item.id === 'you' && currUser?.username ? (
                <div
                  className="mini-sidebar-avatar-fallback"
                  style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', color: '#09090b', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  {currUser.username.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Icon className="mini-sidebar-icon" />
              )}
              <span className="mini-sidebar-label">{item.miniLabel || item.label}</span>
            </button>
          )
        })}
      </aside>

      {/* Floating Action Button (+) for mobile - directly above bottom sidebar on the right */}
      <div className="mobile-fab-container">
        {showMobileCreate && (
          <>
            <div
              className="mobile-fab-backdrop"
              onClick={() => setShowMobileCreate(false)}
            />
            <div className="mobile-fab-menu">
              <button
                type="button"
                className="mobile-fab-menu-item"
                onClick={() => {
                  setShowMobileCreate(false)
                  handleNavigation('/create-video')
                }}
              >
                <svg viewBox="0 0 24 24" className="mobile-fab-menu-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>Upload video</span>
              </button>
              <button
                type="button"
                className="mobile-fab-menu-item"
                onClick={() => {
                  setShowMobileCreate(false)
                  handleNavigation('/upload-tweet')
                }}
              >
                <svg viewBox="0 0 24 24" className="mobile-fab-menu-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Create tweet</span>
              </button>
            </div>
          </>
        )}
        <button
          type="button"
          className={`mobile-fab-btn ${showMobileCreate ? 'active' : ''}`}
          onClick={() => {
            if (!exists) {
              setShowLoginCard(true)
            } else {
              setShowMobileCreate((prev) => !prev)
            }
          }}
          aria-label="Create content"
          title="Create"
        >
          <PlusIcon className="mobile-fab-icon" />
        </button>
      </div>

      {/* Full Sliding Drawer Sidebar (Appears when menu is clicked) */}
      <aside className={`sidebar-drawer ${isOpen ? 'open' : 'closed'}`}>
        {/* Drawer Header with Close Button */}
        <div className="sidebar-header">
          <div className="sidebar-brand-mini" onClick={() => handleNavigation('/')}>
            <YarnTVLogo className="brand-logo-sm" />
            <span className="brand-name-mini">
              yarn<span style={{ color: 'var(--accent-purple)' }}>TV</span>
            </span>
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
          {exists && (
            <button
              type="button"
              className="sidebar-link sidebar-link-logout"
              onClick={handleLogout}
            >
              <LogoutIcon className="sidebar-icon" />
              <span className="sidebar-label">Log out</span>
            </button>
          )}
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
