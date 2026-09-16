import React from 'react'

function Channel() {
  // =========================================================================
  // States, effects, and API handlers for Channel / User Profile go here.
  // (e.g., fetching current user, channel videos, watch history, etc.)
  // =========================================================================

  return (
    <main className="channel-content">
      {/* Channel Header / Profile banner */}
      <section className="channel-header">
        <div className="channel-avatar-large">
          <span>S</span>
        </div>
        <div className="channel-info">
          <h1 className="channel-display-name">Swarnava</h1>
          <p className="channel-handle">@swarnava · View channel</p>
          <div className="channel-actions-row">
            <button type="button" className="btn-channel-edit">
              Customize channel
            </button>
            <button type="button" className="btn-channel-manage">
              Manage videos
            </button>
          </div>
        </div>
      </section>

      {/* History Section matching YouTube screenshot */}
      <section className="channel-section">
        <div className="section-title-row">
          <h2 className="section-heading">History</h2>
          <button type="button" className="btn-see-all">See all</button>
        </div>

        <div className="channel-videos-row">
          <div className="channel-video-card">
            <div className="channel-video-thumb">
              <img
                src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80"
                alt="Taking backend to next level"
              />
              <span className="duration-badge">24:33</span>
            </div>
            <div className="channel-video-meta">
              <h3 className="video-title-grid">Taking backend to next level</h3>
              <p className="channel-name">Chai aur Code ✓</p>
              <p className="video-meta">203k views · 2 years ago</p>
            </div>
          </div>

          <div className="channel-video-card">
            <div className="channel-video-thumb">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                alt="JavaScript Fundamentals"
              />
              <span className="duration-badge">20:45</span>
            </div>
            <div className="channel-video-meta">
              <h3 className="video-title-grid">JavaScript Fundamentals</h3>
              <p className="channel-name">Code Master</p>
              <p className="video-meta">10.3k views · 44 minutes ago</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Channel
