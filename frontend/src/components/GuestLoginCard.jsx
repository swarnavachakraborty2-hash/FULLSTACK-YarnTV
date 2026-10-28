import React from 'react'
import { useNavigate } from 'react-router-dom'

function GuestLoginCard({ onClose }) {
  const navigate = useNavigate()

  return (
    <div className="guest-card-overlay" onClick={onClose}>
      <div className="guest-card-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top-corner cross button */}
        <button
          type="button"
          
          onClick={onClose}
          aria-label="Close"
        >
        ✕
        </button>

        {/* Two-column layout */}
        <div className="guest-card-columns">
          {/* Column 1: Luxury icon column */}
          <div className="guest-card-col-icon">
            <div className="guest-card-icon-badge">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Column 2: Text & Buttons column */}
          <div className="guest-card-col-content">
            <h2 className="guest-card-heading">Please login or register</h2>
            <p className="guest-card-desc">
              Sign in to manage your creator channel, access admin statistics, view your watch history, and like or comment on videos.
            </p>

            {/* Action Buttons */}
            <div className="guest-card-actions">
              <button
                type="button"
                className="guest-card-btn guest-card-btn-login"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                type="button"
                className="guest-card-btn guest-card-btn-register"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestLoginCard
