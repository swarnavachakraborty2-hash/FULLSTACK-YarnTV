import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from '../utils/formatters'
import GuestLoginCard from '../components/GuestLoginCard'

function WatchVideo() {
  const [Id, setUserId] = useState()
  const [video, setVideo] = useState()
  const [views, setviews] = useState(0)
  const [likes, setLikes] = useState(0)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [liked, setLiked] = useState(false)
  const [subscribers, setSubscribers] = useState([])
  const [subscribed, setSubscribed] = useState(false)
  const [dislikes, setDisLikes] = useState(0)
  const [disliked, setDisLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [comment, setComment] = useState("")
  const [totalComments, setTotalcomments] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [showdropDown, setShowDropdown] = useState(false)
  const [playlistOptions, setPlaylistOptions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [playlistDesc, setPlaylistDesc] = useState("")
  const [showLoginCard, setShowLoginCard] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get("user/curr-user")
      .then((res) => {
        if (res.data) {
          setUserId(res.data.data._id)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
        setUserId(null)
      })
  }, [id])

  // Increase the views if user stays on a video for 3 seconds minimum
  useEffect(() => {
    const timer = setTimeout(() => {
      api.get(`video/watch-video/${id}`)
        .then((res) => console.log(res.data.message))
        .catch((err) => console.log(err.response?.data?.message))
    }, 3000);

    return () => clearTimeout(timer)
  }, [id])

  useEffect(() => {
    api.get(`video/get-video/${id}`)
      .then((res) => {
        if (res.data.data) {
          setVideo(res.data.data.videoFile)
          setviews(res.data.data.views)
          setDisLikes(res.data.data.dislikes)
          setLikes(res.data.data.likes)
          setDisLiked(res.data.data.isDisliked)
          setLiked(res.data.data.isLiked)
          setSubscribers(res.data.data.owner?.subscribers || 0)
          setSubscribed(res.data.data.owner?.isSubscribed || false)
          setTitle(res.data.data.title)
          setDesc(res.data.data.description)
          setUsername(res.data.data.owner?.username || "")
          setAvatar(res.data.data.owner?.avatar || "")
          setTotalcomments(res.data.data.totalComments || 0)
        }
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [id, liked, subscribers, comments, disliked])

  useEffect(() => {
    api.get(`video/get-comments-video/${id}`)
      .then((res) => {
        setComments(res.data.data || [])
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [video])

  useEffect(() => {
    api.get("video/get-feed-videos")
      .then((res) => {
        setVideos(res.data.data?.videos || res.data.data || [])
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }, [video])

  const onSubscribe = () => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.get(`subscription/${username}`)
      .then((res) => {
        setSubscribed(res.data.data.isSubscribed)
        setSubscribers(res.data.data.subscribers)
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onLike = () => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.get(`like/video/${id}`)
      .then((res) => {
        setLiked(res.data.data.isLiked)
        setLikes(res.data.data.likes)
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onDislike = () => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.get(`video/dislike-video-toggle/${id}`)
      .then((res) => {
        setDisLiked(res.data.data.isDisliked)
        setDisLikes(res.data.data.dislikes)
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onCommentSubmit = (e) => {
    e.preventDefault()
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.post(`video/comment-video/${id}`, { comment })
      .then((res) => {
        setComments(res.data.data)
        setComment("")
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onLikeComment = (comment_id) => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.get(`like/comment/${comment_id}`)
      .then((res) => {
        setComments((prevComments) =>
          prevComments.map((prevComment) =>
            prevComment._id === comment_id
              ? { ...prevComment, likes: res.data.data.likes, isLiked: res.data.data.isLiked }
              : prevComment
          )
        )
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onDeleteComment = (comment_id) => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    api.delete(`video/delete-comment-video/${id}/${comment_id}`)
      .then((res) => {
        setComments(res.data.data)
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onClickSave = () => {
    if (!Id) {
      setShowLoginCard(true)
      return
    }
    if (showdropDown) {
      setShowDropdown(false)
      return
    }
    setShowForm(false)
    api.get(`playlist/get-currentUser-playlists-options/${Id}`)
      .then((res) => {
        setShowDropdown(true)
        setPlaylistOptions(res.data.data || [])
      })
      .catch((err) => {
        console.log(err.response?.data)
        setShowDropdown(true)
        setPlaylistOptions([])
      })
  }

  const onClickPlaylistOptions = (option_id) => {
    api.get(`playlist/save-video-playlist/${option_id}/${id}`)
      .then(() => setShowDropdown(false))
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onCreateNewPlaylist = (e) => {
    e.preventDefault()
    api.post(`playlist/create-new-playlist/${id}`, { name: playlistName, description: playlistDesc })
      .then(() => {
        setShowForm(false)
        setPlaylistName("")
        setPlaylistDesc("")
      })
      .catch((err) => {
        console.log(err.response?.data)
        setShowForm(false)
      })
  }

  const onClickNewPlaylist = () => {
    setShowDropdown(false)
    setShowForm(true)
  }

  const handleProfileNavigation = () => {
    if (Id) {
      navigate(`/profile/${username}`)
    } else {
      setShowLoginCard(true)
    }
  }

  return (
    <div className="watch-page">
      {/* ── Left: video + info ── */}
      <div className="watch-main">

        {/* Video Player */}
        <div className="watch-player-wrapper">
          {video ? (
            <video
              className="watch-video-player"
              src={video}
              controls
              autoPlay
            />
          ) : (
            <div className="watch-player-skeleton" />
          )}
        </div>

        {/* Title */}
        <h1 className="watch-title">{title}</h1>

        {/* Info Row (Channel + Actions) */}
        <div className="watch-video-info-row">
          <div className="watch-channel-group">
            <div
              className="watch-channel-info"
              onClick={() => handleProfileNavigation()}
            >
              {avatar ? (
                <img src={avatar} alt={username} className="watch-channel-avatar" />
              ) : (
                <div className="watch-channel-avatar watch-channel-avatar--placeholder">
                  {username?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="watch-channel-name">{username}</p>
                <p className="watch-channel-subs">
                  {Array.isArray(subscribers) ? formatViews(subscribers.length) : formatViews(subscribers)} Subscribers
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`watch-subscribe-btn${subscribed ? ' watch-subscribe-btn--subscribed' : ''}`}
              onClick={onSubscribe}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="watch-actions-group">
            <div className="watch-vote-group">
              <button
                type="button"
                className={`watch-vote-btn${liked ? ' watch-vote-btn--active' : ''}`}
                onClick={onLike}
              >
                {/* thumb-up SVG */}
                <svg viewBox="0 0 24 24" className="watch-vote-icon" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                <span>{likes}</span>
              </button>

              <button
                type="button"
                className={`watch-vote-btn${disliked ? ' watch-vote-btn--active' : ''}`}
                onClick={onDislike}
              >
                {/* thumb-down SVG */}
                <svg viewBox="0 0 24 24" className="watch-vote-icon" fill="currentColor">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                </svg>
                <span>{dislikes}</span>
              </button>
            </div>

            {/* Save to Playlist Button & Dropdown */}
            <div className="watch-save-container">
              <button
                type="button"
                className={`watch-save-btn${showdropDown || showForm ? ' watch-save-btn--active' : ''}`}
                onClick={onClickSave}
              >
                <svg viewBox="0 0 24 24" className="watch-save-icon" fill="currentColor">
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
                </svg>
                <span>Save</span>
              </button>

              {/* Dropdown with available playlists */}
              {showdropDown && (
                <div className="watch-playlist-dropdown">
                  <div className="watch-playlist-dropdown-header">
                    <span>Save to playlist</span>
                    <button
                      type="button"
                      className="watch-dropdown-close"
                      onClick={() => setShowDropdown(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="watch-playlist-options-list">
                    {playlistOptions && playlistOptions.length > 0 ? (
                      playlistOptions.map((option) => (
                        <button
                          key={option._id}
                          type="button"
                          className="watch-playlist-option-item"
                          onClick={() => onClickPlaylistOptions(option._id)}
                        >
                          <svg viewBox="0 0 24 24" className="watch-playlist-option-icon" fill="currentColor">
                            <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/>
                          </svg>
                          <span className="watch-playlist-option-name">{option.name}</span>
                        </button>
                      ))
                    ) : (
                      <p className="watch-no-playlists">No playlists found</p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="watch-create-playlist-btn"
                    onClick={onClickNewPlaylist}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    <span>Create New Playlist</span>
                  </button>
                </div>
              )}

              {/* Create New Playlist Form */}
              {showForm && (
                <div className="watch-playlist-dropdown watch-playlist-form-dropdown">
                  <div className="watch-playlist-dropdown-header">
                    <span>New Playlist</span>
                    <button
                      type="button"
                      className="watch-dropdown-close"
                      onClick={() => {
                        setShowForm(false);
                        setPlaylistName("");
                        setPlaylistDesc("");
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={onCreateNewPlaylist} className="watch-create-playlist-form">
                    <div className="watch-form-group">
                      <label className="watch-form-label">Title</label>
                      <input
                        type="text"
                        className="watch-form-input"
                        placeholder="Enter playlist title..."
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="watch-form-group">
                      <label className="watch-form-label">Description</label>
                      <textarea
                        className="watch-form-textarea"
                        placeholder="Enter description..."
                        value={playlistDesc}
                        onChange={(e) => setPlaylistDesc(e.target.value)}
                        rows="2"
                      />
                    </div>

                    <div className="watch-form-actions">
                      <button
                        type="button"
                        className="watch-form-btn-cancel"
                        onClick={() => {
                          setShowForm(false);
                          setPlaylistName("");
                          setPlaylistDesc("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="watch-form-btn-submit"
                        disabled={!playlistName.trim()}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="watch-description">
          <p className="watch-views-date">{formatViews(views)} Views</p>
          {desc && (
            <>
              <p className={`watch-desc-text${showFullDesc ? ' watch-desc-text--expanded' : ''}`}>
                {desc}
              </p>
              <button
                type="button"
                className="watch-desc-toggle"
                onClick={() => setShowFullDesc((v) => !v)}
              >
                {showFullDesc ? 'Show less' : 'Show more'}
              </button>
            </>
          )}
        </div>

        {/* Comments Section */}
        <div className="watch-comments-section">
          <h2 className="watch-comments-heading">{totalComments} Comments</h2>

          {/* Add comment */}
          <form className="watch-add-comment" onSubmit={onCommentSubmit}>
            <input
              type="text"
              className="watch-comment-input"
              placeholder="Add a comment..."
              value={comment}
              onClick={() => {
                if (!Id) setShowLoginCard(true)
              }}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="watch-comment-submit"
              disabled={!comment.trim()}
            >
              Post
            </button>
          </form>

          {/* Comment list */}
          <div className="watch-comments-list">
            {comments && comments.map((c) => (
              <div key={c._id} className="watch-comment-card">
                {/* Avatar */}
                {c.owner?.avatar ? (
                  <img
                    src={c.owner.avatar}
                    alt={c.owner.username}
                    className="watch-comment-avatar"
                    onClick={() => handleProfileNavigation(c.owner?.username)}
                  />
                ) : (
                  <div
                    className="watch-comment-avatar watch-comment-avatar--placeholder"
                    onClick={() => handleProfileNavigation(c.owner?.username)}
                  >
                    {c.owner?.username?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Body */}
                <div className="watch-comment-body">
                  <div className="watch-comment-header">
                    <span
                      className="watch-comment-author"
                      onClick={() => handleProfileNavigation(c.owner?.username)}
                    >
                      {c.owner?.username}
                    </span>
                    <span className="watch-comment-time">
                      · {formatTimeAgo(c.createdAt)}
                    </span>
                  </div>

                  <p className="watch-comment-text">{c.content || c.comment}</p>

                  <div className="watch-comment-actions">
                    {/* Like button */}
                    <button
                      type="button"
                      className={`watch-comment-like-btn${c.isLiked ? ' watch-comment-like-btn--liked' : ''}`}
                      onClick={() => onLikeComment(c._id)}
                    >
                      <svg viewBox="0 0 24 24" className="watch-comment-like-icon" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                      </svg>
                      <span>{c.likes ?? 0}</span>
                    </button>

                    {/* Delete */}
                    {Id && c.owner?._id === Id && (
                      <button
                        type="button"
                        className="watch-comment-delete-btn"
                        onClick={() => onDeleteComment(c._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: related videos ── */}
      <aside className="watch-sidebar">
        {videos && videos.map((v) => (
          <div
            key={v._id}
            className="watch-related-card"
            onClick={() => navigate(`/watch/${v._id}`)}
          >
            <div className="watch-related-thumb-wrapper">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="watch-related-thumb"
              />
              <span className="duration-badge">{formatDuration(v.duration)}</span>
            </div>
            <div className="watch-related-info">
              <p className="watch-related-title">{v.title}</p>
              <p className="watch-related-channel">{v.owner?.username}</p>
              <p className="watch-related-meta">
                {formatViews(v.views)} Views · {formatTimeAgo(v.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </aside>

      {/* Guest Login / Register Card Modal */}
      {showLoginCard && (
        <GuestLoginCard onClose={() => setShowLoginCard(false)} />
      )}
    </div>
  )
}

export default WatchVideo
