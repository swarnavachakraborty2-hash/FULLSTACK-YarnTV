import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { apiCall } from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"
import { CameraIcon } from '../components/Icons'

function Profile() {

  const navigate = useNavigate()

  const [userId, setUserId] = useState("")
  const [avatar, setAavatar] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [history, setHistory] = useState([])
  const [liked, setLiked] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [updatingAvatar, setUpdatingAvatar] = useState(false)
  const [updatingCover, setUpdatingCover] = useState(false)

  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  useEffect(() => {
    apiCall(() => api.get("user/curr-user")
      .then((res) => {
        if (res.data) {
          setUserId(res.data.data._id)
          setAavatar(res.data.data.avatar)
          setCoverImage(res.data.data.coverImage)
          setUsername(res.data.data.username)
          setFullname(res.data.data.fullname)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      }))
  }, [userId])

  useEffect(() => {
    apiCall(() => api.get("video/get-watched-videos")
      .then((res) => {
        if (res.data) {
          setHistory(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      }))
  }, [])

  useEffect(() => {
    apiCall(() => api.get("video/get-liked-videos")
      .then((res) => {
        if (res.data) {
          setLiked(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      }))
  }, [])

  useEffect(() => {
    if (!userId) return // wait until we actually have a user id

    apiCall(() => api.get(`playlist/get-user-playlists/${userId}`)
      .then((res) => {
        if (res.data) {
          setPlaylists(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      }))
  }, [userId])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("avatar", file)
    setUpdatingAvatar(true)
    apiCall(() => api.patch("user/edit-avatar", formData)
      .then((res) => {
        if (res.data?.data?.avatar) {
          setAavatar(res.data.data.avatar)
        }
        setUpdatingAvatar(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setUpdatingAvatar(false)
      }))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("coverImage", file)
    setUpdatingCover(true)
    apiCall(() => api.patch("user/edit-coverImage", formData)
      .then((res) => {
        if (res.data?.data?.coverImage) {
          setCoverImage(res.data.data.coverImage)
        }
        setUpdatingCover(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setUpdatingCover(false)
      }))
  }
  
  return (
    <main className="channel-content">

      {/* Banner Image */}
      <div className="channel-banner" style={{ position: 'relative' }}>
        {coverImage ? (
          <img src={coverImage} alt="Channel banner" />
        ) : (
          <div className="channel-banner-placeholder" />
        )}
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverChange}
        />
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          title="Edit cover image"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(18, 18, 18, 0.75)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 3
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.75)'}
        >
          <CameraIcon style={{ width: '14px', height: '14px' }} />
          <span>{updatingCover ? "Uploading..." : "Edit Cover"}</span>
        </button>
      </div>

      {/* Channel Header / Profile info */}
      <section className="channel-header">
        <div className="channel-avatar-large" style={{ position: 'relative' }}>
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span>{username?.charAt(0).toUpperCase()}</span>
          )}
          <input
            type="file"
            ref={avatarInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            title="Edit avatar"
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              backgroundColor: 'var(--accent-purple)',
              border: '3px solid var(--bg-main)',
              color: '#09090b',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'transform 0.15s ease',
              zIndex: 4
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <CameraIcon style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
        <div className="channel-info">
          <h1 className="channel-display-name">{fullname || username}</h1>
          <p className="channel-handle">@{username} · View channel</p>
          <div className="channel-actions-row">
            <button type="button" onClick={() => navigate("/customize-channel")} className="btn-channel-edit">
              Customize channel
            </button>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="channel-section">
        <div className="section-title-row">
          <h2 className="section-heading">History</h2>
          <button type="button" onClick={() => navigate('/history')} className="btn-see-all">
            See all
          </button>
        </div>

        {history.length > 0 ? (
          <div className="channel-videos-row">
            {history.map((video, i) => (
              i<=2 &&
              <div
                key={video._id}
                className="channel-video-card"
                onClick={() => navigate(`/watch/${video._id}`)}
              >
                <div className="channel-video-thumb">
                  <img src={video.thumbnail} alt={video.title} />
                  <span className="duration-badge">{formatDuration(video.duration)}</span>
                </div>
                <div className="channel-video-meta">
                  <h3 className="video-title-grid">{video.title}</h3>
                  <p className="channel-name">{video.owner?.username}</p>
                  <p className="video-meta">
                    {formatViews(video.views)} views · {formatTimeAgo(video.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="video-meta">No watch history yet.</p>
        )}
      </section>

      {/* Playlists Section */}
      <section className="channel-section">
        <div className="section-title-row">
          <h2 className="section-heading">Playlists</h2>
          <button type="button" onClick={() => navigate('/channel/playlists')} className="btn-see-all">
            See all
          </button>
        </div>

        {playlists.length > 0 ? (
          <div className="channel-videos-row">
            {playlists.map((playlist, i) => (
              i<=2 &&
              <div
                key={playlist._id}
                className="channel-video-card"
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                <div className="channel-video-thumb">
                  <img
                    src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
                    alt={playlist.name}
                  />
                  <span className="duration-badge">
                    🎞 {playlist.videos} videos
                  </span>
                </div>
                <div className="channel-video-meta">
                  <h3 className="video-title-grid">{playlist.name}</h3>
                  <p className="channel-name">Playlist</p>
                  <p className="video-meta">View full playlist</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="video-meta">No playlists yet.</p>
        )}
      </section>

      {/* Liked Videos Section */}
      <section className="channel-section">
        <div className="section-title-row">
          <h2 className="section-heading">Liked videos</h2>
          <button type="button" onClick={() => navigate('/liked')} className="btn-see-all">
            See all
          </button>
        </div>

        {liked.length > 0 ? (
          <div className="channel-videos-row">
            {liked.map((item, i) => (
              i<=2 &&
              <div
                key={item._id}
                className="channel-video-card"
                onClick={() => navigate(`/watch/${item.video?._id}`)}
              >
                <div className="channel-video-thumb">
                  <img src={item.video?.thumbnail} alt={item.video?.title} />
                  <span className="duration-badge">{formatDuration(item.video?.duration)}</span>
                </div>
                <div className="channel-video-meta">
                  <h3 className="video-title-grid">{item.video?.title}</h3>
                  <p className="channel-name">{item.video?.owner?.username}</p>
                  <p className="video-meta">
                    {formatViews(item.video?.views)} views · {formatTimeAgo(item.video?.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="video-meta">No liked videos yet.</p>
        )}
      </section>

    </main>
  )
}

export default Profile
