import React from 'react'
import { useState, useEffect } from 'react'
import api, { apiCall } from "../api/axios"
import StatsChart from '../components/statsChart'
import SubscriberChart from '../components/subscriberChart'

function Admin() {

  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [avatar, setAvatar] = useState("")

  const [totalVideos, setTotalVideos] = useState(0)
  const [videos, setVideos] = useState([])
  const [totalSubscribers, setTotalSubscribers] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [editingVideoId, setEditingVideoId] = useState(null)
  const [err, setErr] = useState("")
  const [subscribers, setSubscribers] = useState([])


  useEffect(() => {
    apiCall(() => api.get(`/video/get-admin-stats`)
      .then((res) => {
        setAvatar(res.data.data.avatar)
        setUsername(res.data.data.username)
        setFullname(res.data.data.fullname)
        setTotalLikes(res.data.data.totalLikes ?? 0)
        setTotalSubscribers(res.data.data.totalSubscribers ?? res.data.data.subscribers?.length ?? 0)
        setTotalViews(res.data.data.totalViews ?? 0)
        res.data.data.subscribers.length > 0 &&
          setSubscribers(res.data.data.subscribers)
      })
      .catch((err) => {
        if (err?.response?.data) {
          setErr(err.response.data)
        }
      }))
  }, [])


  useEffect(() => {
    apiCall(() => api.get("/video/get-admin-videos")
      .then((res) => {
        setTotalVideos(res.data.data.createdVideos.length)
        setVideos(res.data.data.createdVideos) //shows all the list of videos
      })
      .catch((err) => {
        if (err?.response?.data) {
          setErr(err.response.data)
        }
      }))
  }, [])


  const onDelete = (v_id) => {
    apiCall(() => api.delete(`video/delete-video/${v_id}`)
      .then((res) => {
        setVideos((prevVideos) =>
          prevVideos.filter((prev_video) =>
            prev_video._id !== v_id.toString()
          )
        )
        setTotalVideos((prev) => prev - 1)
      })
      .catch((err) => {
        if (err?.response?.data) {
          setErr(err.response.data)
        }
      }))
  }


  const onPublishToggle = (v_id) => {
    apiCall(() => api.get(`video/publish-toggle-video/${v_id}`)
      .then((res) => {
        setVideos((prevVideos) =>
          prevVideos.map((prev_video) =>
            prev_video._id === v_id ? { ...prev_video, isPublished: res.data.data.isPublished } : prev_video
          )
        )
      })
      .catch((err) => {
        if (err?.response?.data) {
          setErr(err.response.data)
        }
      }))
  }


  const onUpdateVideo = (e, v_id) => {
    e.preventDefault();
    apiCall(() => api.patch(`video/update-video/${v_id}`, { title, description })
      .then((res) => {
        setVideos((prevVideos) =>
          prevVideos.map((prev_video) =>
            prev_video._id === v_id ? { ...prev_video, title: res.data.data.title, description: res.data.data.description } : prev_video
          )
        )
        setShowUpdateForm(false)
        setEditingVideoId(null)
      })
      .catch((err) => {
        if (err?.response?.data) {
          setErr(err.response.data)
        }
        setShowUpdateForm(false)
      }))
  }

  //areachart
  const chartData = subscribers.map((subscriber, index) => {
    const d = new Date(subscriber.createdAt).toDateString();
    return {
      date: d,
      subscribers: index + 1
    }
  })
  //if more than one subscription happens on the same day , add their subscribers
  //if an element with same date in curr exists in acc array, update the previous acc's element's subscriber to the new one otherwise push the element with unique date
  const subscribersData = chartData.reduce((acc, curr) => {
    const found = acc.find((i) => i.date === curr.date)
    if (found) {
      found.subscribers = curr.subscribers
    }
    else {
      acc.push(curr)
    }
    return acc
  }, [])


  //linechart
  const statsData = videos.map((video) => {
    const d = new Date(video.createdAt);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    return {
      time: timeStr,
      views: video.views,
      likes: video.likes
    }
  })

  //update video form
  const handleStartEdit = (video) => {
    if (editingVideoId === video._id) {
      setEditingVideoId(null)
      setShowUpdateForm(false)
    } else {
      setEditingVideoId(video._id)
      setTitle(video.title || "")
      setDescription(video.description || "")
      setShowUpdateForm(true)
    }
  }

  return (
    <main className="feed-content" style={{ padding: '32px 36px', height: '100%', overflowY: 'auto' }}>
      <div className="admin-dashboard-wrapper">

        {/* Header Section */}
        <div className="admin-header">
          <div className="admin-header-info">
            {avatar && (
              <img src={avatar} alt={fullname || username} className="admin-header-avatar" />
            )}
            <div>
              <h1 className="admin-header-title">Creator Dashboard</h1>
              <p className="admin-header-subtitle">
                Welcome back, <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{fullname || username || 'Creator'}</span>
                {username && <span style={{ color: 'var(--text-muted)' }}> (@{username})</span>}
              </p>
            </div>
          </div>
          <div className="admin-badge-creator">
            <span>●</span> Creator Studio Active
          </div>
        </div>

        {/* 1. Four KPI Cards Side by Side (Subscribers, Videos, Likes, Views) */}
        <div className="admin-kpi-grid">
          {/* Card 1: Subscribers */}
          <div className="admin-kpi-card kpi-subs">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Subscribers</span>
              <div className="admin-kpi-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-value">{totalSubscribers}</div>
            <span className="admin-kpi-trend">Total channel subscribers</span>
          </div>

          {/* Card 2: Total Videos */}
          <div className="admin-kpi-card kpi-videos">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Total Videos</span>
              <div className="admin-kpi-icon-badge" style={{ background: 'rgba(174, 122, 255, 0.12)', color: 'var(--accent-purple)' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-value">{totalVideos}</div>
            <span className="admin-kpi-trend">Uploaded content library</span>
          </div>

          {/* Card 3: Total Likes */}
          <div className="admin-kpi-card kpi-likes">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Total Likes</span>
              <div className="admin-kpi-icon-badge" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-value">{totalLikes}</div>
            <span className="admin-kpi-trend">Viewer positive reactions</span>
          </div>

          {/* Card 4: Total Views */}
          <div className="admin-kpi-card kpi-views">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Total Views</span>
              <div className="admin-kpi-icon-badge" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-value">{totalViews}</div>
            <span className="admin-kpi-trend">Lifetime video impressions</span>
          </div>
        </div>

        {/* 2. Area Chart: Subscriber Growth */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div className="admin-chart-title">
              <span style={{ color: '#10b981' }}></span> Subscriber Growth
            </div>
            <span className="admin-chart-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              Cumulative
            </span>
          </div>
          {subscribersData.length > 0 ? (
            <SubscriberChart data={subscribersData} />
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              No subscriber milestones recorded yet.
            </p>
          )}
        </div>

        {/* 3. Line Chart: Views and Likes of the Videos */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div className="admin-chart-title">
              <span style={{ color: 'var(--accent-purple)' }}></span> Video Performance (Views & Likes)
            </div>
            <span className="admin-chart-tag" style={{ background: 'rgba(174, 122, 255, 0.15)', color: 'var(--accent-purple)' }}>
              Per Video
            </span>
          </div>
          {statsData.length > 0 ? (
            <StatsChart data={statsData} />
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              Upload your first video to see performance stats.
            </p>
          )}
        </div>

        {/* 4. List of all videos with thumbnail, title, description, update & delete buttons, and publish/unpublish */}
        <div className="admin-videos-section">
          <div className="admin-videos-header">
            <h2 className="admin-videos-title">Your Uploaded Videos</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
            </span>
          </div>

          <div className="admin-video-list">
            {videos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
                No videos uploaded yet.
              </p>
            ) : (
              videos.map((video) => {
                const isEditing = editingVideoId === video._id;
                return (
                  <div key={video._id} className="admin-video-card">
                    <div className="admin-video-main">
                      {/* Thumbnail */}
                      <img
                        src={video.thumbnail || "https://placehold.co/160x90/18181b/ffffff?text=No+Thumbnail"}
                        alt={video.title}
                        className="admin-video-thumb"
                      />

                      {/* Info */}
                      <div className="admin-video-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 className="admin-video-title">{video.title}</h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: video.isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: video.isPublished ? '#10b981' : '#f59e0b',
                              border: `1px solid ${video.isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                            }}
                          >
                            {video.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>

                        <p className="admin-video-desc">
                          {video.description || "No description provided."}
                        </p>

                        <div className="admin-video-meta">
                          <span> {video.views ?? 0} views</span>
                          <span>•</span>
                          <span> {video.likes ?? 0} likes</span>
                          <span>•</span>
                          <span> {new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="admin-video-actions">
                          {/* Publish/Unpublish toggle */}
                          <button
                            type="button"
                            onClick={() => onPublishToggle(video._id)}
                            className={`admin-btn ${video.isPublished ? 'admin-btn-unpublish' : 'admin-btn-publish'}`}
                          >
                            {video.isPublished ? 'Unpublish' : 'Publish'}
                          </button>

                          {/* Update / Edit button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(video)}
                            className="admin-btn admin-btn-edit"
                          >
                            {isEditing ? 'Cancel Edit' : 'Edit / Update'}
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => onDelete(video._id)}
                            className="admin-btn admin-btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inline update form that appears on clicking update */}
                    {isEditing && (
                      <form
                        onSubmit={(e) => onUpdateVideo(e, video._id)}
                        className="admin-edit-form"
                      >
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Edit Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter video title"
                          required
                          className="admin-edit-input"
                        />

                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Edit Description
                        </label>
                        <textarea
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter video description"
                          rows="3"
                          className="admin-edit-textarea"
                        />

                        <div className="admin-edit-actions">
                          <button
                            type="button"
                            onClick={() => setEditingVideoId(null)}
                            className="admin-btn admin-btn-cancel"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="admin-btn admin-btn-save"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </main>
  )
}

export default Admin

