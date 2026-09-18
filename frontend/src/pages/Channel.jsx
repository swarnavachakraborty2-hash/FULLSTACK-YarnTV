import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function Channel() {

  const navigate = useNavigate()

  const [userId, setUserId] = useState("")
  const [avatar, setAavatar] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [history, setHistory] = useState([])
  const [liked, setLiked] = useState([])
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    api.get("user/curr-user")
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
      })
  }, [])

  useEffect(() => {
    api.get("video/get-watched-videos")
      .then((res) => {
        if (res.data) {
          setHistory(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [])

  useEffect(() => {
    api.get("video/get-liked-videos")
      .then((res) => {
        if (res.data) {
          setLiked(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [])

  useEffect(() => {
    if (!userId) return // wait until we actually have a user id

    api.get(`playlist/get-user-playlists/${userId}`)
      .then((res) => {
        if (res.data) {
          setPlaylists(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [userId])

  return (
    <main className="channel-content">

      {/* Banner Image */}
      <div className="channel-banner">
        {coverImage ? (
          <img src={coverImage} alt="Channel banner" />
        ) : (
          <div className="channel-banner-placeholder" />
        )}
      </div>

      {/* Channel Header / Profile info */}
      <section className="channel-header">
        <div className="channel-avatar-large">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span>{username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="channel-info">
          <h1 className="channel-display-name">{fullname || username}</h1>
          <p className="channel-handle">@{username} · View channel</p>
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

      {/* History Section */}
      <section className="channel-section">
        <div className="section-title-row">
          <h2 className="section-heading">History</h2>
          <button type="button" className="btn-see-all">See all</button>
        </div>

        {history.length > 0 ? (
          <div className="channel-videos-row">
            {history.map((video) => (
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
          <button type="button" className="btn-see-all">See all</button>
        </div>

        {playlists.length > 0 ? (
          <div className="channel-videos-row">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="playlist-card"
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                <div className="playlist-thumb">
                  <img
                    src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
                    alt={playlist.name}
                  />
                  <span className="playlist-video-count">
                    🎞 {playlist.videos} videos
                  </span>
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-title">{playlist.name}</h3>
                  <p className="playlist-meta">Playlist · View full playlist</p>
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
          <button type="button" className="btn-see-all">See all</button>
        </div>

        {liked.length > 0 ? (
          <div className="channel-videos-row">
            {liked.map((item) => (
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

export default Channel