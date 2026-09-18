import React, { useEffect, useState } from 'react'
import { PlayLogo, SearchIcon, MenuIcon, LogoutIcon } from './Icons'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"

function Navbar({ onToggleSidebar }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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
        setUser(null) // not logged in — stay on current page, don't force-navigate
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
        console.log(err.response.data.message)
      })
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
          />
        </div>
      </div>

      {/* Auth Actions */}
      <div className="navbar-actions">
        {user?.username ? (
          <>
            {user.avatar ? (
              <img
                onClick={() => navigate("/channel")}
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