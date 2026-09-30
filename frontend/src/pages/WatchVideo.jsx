import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from '../utils/formatters'

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
  const [myComment, setMycomment] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [confirmingId, setConfirmingId] = useState(null)
  const [showdropDown, setShowDropdown] = useState(false)
  const [playlistOptions, setPlaylistOptions] = useState([])
  const [showForm, setShowForm] = useState(false)

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
      })
  }, [id])


  //increase the views if user stays on a video for 3 seconds minimum
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
          setSubscribers(res.data.data.owner.subscribers)
          setSubscribed(res.data.data.owner.isSubscribed)
          setTitle(res.data.data.title)
          setDesc(res.data.data.description)
          setUsername(res.data.data.owner.username)
          setAvatar(res.data.data.owner.avatar)
          setTotalcomments(res.data.data.totalComments)
        }
      })
  }, [id, liked, subscribers, comments, disliked])

  useEffect(() => {
    api.get(`video/get-comments-video/${id}`)
      .then((res) => {
        setComments(res.data.data)
      })
  }, [video])

  useEffect(() => {
    api.get("video/get-feed-videos")
      .then((res) => {
        setVideos(res.data.data)
      })
  }, [video])

  const onSubscribe = () => {
    api.get(`subscription/${username}`)
      .then((res) => {
        setSubscribed(res.data.data.isSubscribed)
        setSubscribers(res.data.data.subscribers)
      })
  }

  const onLike = () => {
    api.get(`like/video/${id}`)
      .then((res) => {
        setLiked(res.data.data.isLiked)
        setLikes(res.data.data.likes)
      })
  }

  const onDislike = () => {
    api.get(`video/dislike-video-toggle/${id}`)
      .then((res) => {
        setDisLiked(res.data.data.isDisliked)
        setDisLikes(res.data.data.dislikes)
      })
  }

  const onCommentSubmit = (e) => {
    e.preventDefault()
    api.post(`video/comment-video/${id}`, { comment })
      .then((res) => {
        setComments(res.data.data)
        setComment("")
      })
  }

  const onLikeComment = (comment_id) => {
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
  }

  const onDeleteComment = (comment_id) => {
    api.delete(`video/delete-comment-video/${id}/${comment_id}`)
      .then((res) => {
        setComments(res.data.data)
      })
  }


  const onClickSave = () => {
    api.get(`playlist/get-currentUser-playlists-options/${Id}`)
      .then((res) => {
        setPlaylistOptions(res.data.data)
        setShowDropdown(true)
      })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onClickPlaylistOptions = (option_id) => {
    api.get(`playlist/save-video-playlist/${option_id}/${id}`)
      .then(() => { showdropDown(false) })
      .catch((err) => {
        console.log(err.response?.data)
      })
  }

  const onClickNewPlaylist = () => {
    setShowDropdown(false)
    setShowForm(true)
    api.post(`playlist/create-new-playlist/${id}`)
      .then(() => setShowForm(false))
      .catch((err) => {
        console.log(err.response?.data)
      })
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
              onClick={() => navigate(`/profile/${username}`)}
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

        {/* Comments */}
        <div className="watch-comments-section">
          <h2 className="watch-comments-heading">{totalComments} Comments</h2>

          {/* Add comment */}
          <form className="watch-add-comment" onSubmit={onCommentSubmit}>
            <input
              type="text"
              className="watch-comment-input"
              placeholder="Add a comment..."
              value={comment}
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
                    onClick={() => navigate(`/profile/${c.owner?.username}`)}
                  />
                ) : (
                  <div
                    className="watch-comment-avatar watch-comment-avatar--placeholder"
                    onClick={() => navigate(`/profile/${c.owner?.username}`)}
                  >
                    {c.owner?.username?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Body */}
                <div className="watch-comment-body">
                  <div className="watch-comment-header">
                    <span
                      className="watch-comment-author"
                      onClick={() => navigate(`/profile/${c.owner?.username}`)}
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
                    <button
                      type="button"
                      className="watch-comment-delete-btn"
                      onClick={() => onDeleteComment(c._id)}
                    >
                      Delete
                    </button>
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
    </div>
  )
}

export default WatchVideo