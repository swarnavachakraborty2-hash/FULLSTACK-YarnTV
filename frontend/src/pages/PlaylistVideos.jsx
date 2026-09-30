import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { formatViews, formatDuration, formatTimeAgo } from '../utils/formatters'

function PlaylistVideos() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])

  // 3-dot menu
  const [showDropdown, setShowDropdown] = useState(false)
  const [showForm, setShowform] = useState(false)
  const [description, setDescription] = useState('')
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowDropdown(false)
        setShowform(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get(`/playlist/get-playlist-videos/${id}`)
      .then((res) => {
        if (res.data?.data) {
          setPlaylist(res.data.data)
          setVideos(res.data.data.videos || [])
          setDescription(res.data.data.description || '')
        } else {
          setPlaylist(null)
        }
      })
      .catch((err) => {
        console.error('Error fetching playlist videos:', err)
        setPlaylist(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="feed-content">
        <p className="video-meta">Loading playlist...</p>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="feed-content">
        <p className="video-meta">Playlist not found.</p>
      </div>
    )
  }

  const onClickUpdateDesc = (e) => {
    e.preventDefault()
    api.patch(`playlist/update-playlist-details/${id}`, { description })
      .then(() => {
        setShowDropdown(false)
        setShowform(false)
        setPlaylist(prev => ({ ...prev, description }))
      })
      .catch((err) => console.error(err.response?.data || err))
  }

  const onClickDeletePlaylist = () => {
    api.delete(`playlist/delete-playlist/${id}`)
      .then(() => {
        setShowDropdown(false)
        navigate('/profile')
      })
      .catch((err) => console.error(err.response?.data || err))
  }

  const onClickRemoveVideo = (video_id) => {
    api.delete(`playlist/delete-video-playlist/${id}/${video_id}`)
      .then(() => {
        setVideos(prev => prev.filter(v => v._id !== video_id))
      })
      .catch((err) => console.error(err.response?.data || err))
  }

  return (
    <div className="feed-content">
      <div className="playlist-page">

        {/* ── Left: Playlist Details Column ── */}
        <div className="playlist-details-col">
          {/* Thumbnail */}
          <div className="playlist-details-thumb-container">
            <div className="playlist-details-thumb">
              {playlist.thumbnail ? (
                <img src={playlist.thumbnail} alt={playlist.name} />
              ) : (
                <div className="channel-banner-placeholder" />
              )}
            </div>
          </div>

          <div className="playlist-details-info">
            {/* Title + 3-dot menu */}
            <div className="playlist-title-row">
              <h1 className="playlist-details-title">{playlist.name}</h1>

              {/* 3-dot menu */}
              <div className="playlist-menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  className="playlist-menu-btn"
                  aria-label="Playlist options"
                  onClick={() => {
                    setShowDropdown(prev => !prev)
                    setShowform(false)
                  }}
                >
                  {/* ⋮ three-dots SVG */}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="playlist-dropdown">
                    {/* ── Update Description option ── */}
                    <button
                      type="button"
                      className="playlist-dropdown-item"
                      onClick={() => setShowform(prev => !prev)}
                    >
                      {/* pencil icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Update Description
                    </button>

                    {/* ── Update description inline form ── */}
                    {showForm && (
                      <form className="playlist-update-form" onSubmit={onClickUpdateDesc}>
                        <textarea
                          className="playlist-update-input"
                          placeholder="New description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="playlist-update-submit"
                          disabled={!description.trim()}
                        >
                          Update Description
                        </button>
                      </form>
                    )}

                    {/* ── Delete Playlist option ── */}
                    <button
                      type="button"
                      className="playlist-dropdown-item playlist-dropdown-item--danger"
                      onClick={onClickDeletePlaylist}
                    >
                      {/* trash icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Delete Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Owner row */}
            {playlist.owner && (
              <div
                className="playlist-owner-row"
                onClick={() => navigate(`/profile/${playlist.owner.username}`)}
              >
                {playlist.owner.avatar && (
                  <img
                    src={playlist.owner.avatar}
                    alt={playlist.owner.username}
                    className="playlist-owner-avatar"
                  />
                )}
                <span className="playlist-owner-name">
                  {playlist.owner.fullname || playlist.owner.username}
                </span>
              </div>
            )}

            <div className="playlist-details-meta">
              <span>{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
              <span className="dot-separator">·</span>
              <span>{formatViews(playlist.totalViews || 0)} views</span>
            </div>

            {playlist.description && (
              <p className="playlist-details-description">{playlist.description}</p>
            )}
          </div>
        </div>

        {/* ── Right: Videos List Column ── */}
        <div className="playlist-videos-col">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div
                key={video._id}
                className="playlist-video-card"
                onClick={() => navigate(`/watch/${video._id}`)}
              >
                <span className="playlist-video-index">{index + 1}</span>

                <div className="playlist-video-thumb-wrapper">
                  <img src={video.thumbnail} alt={video.title} />
                  <span className="duration-badge">{formatDuration(video.duration)}</span>
                </div>

                <div className="playlist-video-info">
                  <h3 className="playlist-video-title" title={video.title}>
                    {video.title}
                  </h3>

                  <div
                    className="playlist-video-channel"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (video.owner?.username) navigate(`/profile/${video.owner.username}`)
                    }}
                  >
                    {video.owner?.avatar && (
                      <img
                        src={video.owner.avatar}
                        alt={video.owner?.username}
                        className="channel-avatar-sm"
                      />
                    )}
                    <span className="channel-name">{video.owner?.username}</span>
                  </div>

                  <p className="playlist-video-meta">
                    <span>{formatViews(video.views)} views</span>
                    <span className="dot-separator">·</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </p>

                  {video.description && (
                    <p className="playlist-video-desc">{video.description}</p>
                  )}

                  {/* Remove from playlist */}
                  <button
                    type="button"
                    className="playlist-video-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClickRemoveVideo(video._id)
                    }}
                  >
                    {/* trash icon */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="video-meta">No videos in this playlist yet.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default PlaylistVideos