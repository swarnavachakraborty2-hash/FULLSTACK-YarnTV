import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PlayLogo, SearchIcon, MenuIcon, LogoutIcon, PlusIcon } from './Icons'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"

function Navbar({ onToggleSidebar }) {
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const debounceRef = useRef(null)
  const [showPostOptions, setShowPostOptions] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)


  useEffect(() => {
    api.get("/user/curr-user")
      .then((res) => {
        if (res.data.data) {
          setUser(res.data.data)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const handleLogout = () => {
    api.get("/user/logout")
      .then((res) => {
        console.log(res.data.data.message)
        setUser(null)
        navigate("/login")
      })
      .catch((err) => {
        console.log(err.response?.data?.message)
      })
  }

  const fetchSuggestions = useCallback((value) => {
    if (!value.trim()) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    api.post("/video/search-video-name", { letter: value })
      .then((res) => {
        if (res.data?.data) {
          setSuggestions(res.data.data)
          setShowDropdown(true)
        }
      })
      .catch(() => {
        setSuggestions([])
        setShowDropdown(false)
      })
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  const handleSelectSuggestion = (title) => {
    setSearch(title)
    setSuggestions([])
    setShowDropdown(false)
    navigate(`/feed/search/${encodeURIComponent(title)}`)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      setShowDropdown(false)
      navigate(`/feed/search/${encodeURIComponent(search)}`)
    }
  }

  return (
    <header className="navbar">
      {/* Brand / Logo + Menu toggle button */}
      <div className="navbar-brand">
        <button
          type="button"
          className="btn-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon className="menu-icon" />
        </button>
        <PlayLogo className="brand-logo" />
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            name="title"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            autoComplete="off"
          />
        </div>

        {showDropdown && suggestions.length > 0 && (
          <ul className="search-dropdown">
            {suggestions.map((video) => (
              <li
                key={video._id}
                className="search-dropdown-item"
                onMouseDown={(e) => e.preventDefault()} // only stops blur — no selection logic here
                onClick={() => handleSelectSuggestion(video.title)} // your actual click handler, untouched
              >
                {video.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Auth Actions */}
      <div className="navbar-actions">

        {user?.username && (
          <div className="navbar-create">
            <button
              type="button"
              className="btn-create"
              onClick={() => setShowCreateMenu((v) => !v)}
              aria-label="Create"
              title="Create"
            >
              <PlusIcon className="create-icon" />
            </button>

            {showCreateMenu && (
              <ul className="create-dropdown">
                <li
                  className="create-dropdown-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowCreateMenu(false)
                    navigate("/create-video")
                  }}
                >
                  <svg viewBox="0 0 24 24" className="create-dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Upload video
                </li>
                <li
                  className="create-dropdown-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowCreateMenu(false)
                    navigate("/upload-tweet")
                  }}
                >
                  <svg viewBox="0 0 24 24" className="create-dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Create tweet
                </li>
              </ul>
            )}
          </div>
        )}


        {user?.username ? (
          <>
            {user.avatar ? (
              <img
                onClick={() => navigate("/profile")}
                src={user.avatar}
                alt={user.username}
                className="navbar-avatar"
              />
            ) : (
              <div
                onClick={() => navigate("/channel")}
                className="navbar-avatar navbar-avatar-fallback"
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon className="logout-icon" />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} type="button" className="btn-login">
              Log in
            </button>
            <button onClick={() => navigate("/register")} type="button" className="btn-signup">
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar