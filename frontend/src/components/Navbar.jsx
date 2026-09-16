import React from 'react'
import { PlayLogo, SearchIcon, MenuIcon } from './Icons'

function Navbar({ onToggleSidebar }) {
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
        <button type="button" className="btn-login">
          Log in
        </button>
        <button type="button" className="btn-signup">
          Sign up
        </button>
      </div>
    </header>
  )
}

export default Navbar
