import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function SubscribedTo() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get("subscription/get-subscribed-to-users")
      .then((res) => {
        if (res.data.data) {
          const allVideos = res.data.data
          // Sort by newest 
          allVideos.sort((a, b) => a.createdAt - b.createdAt)
          setVideos(allVideos)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        if (err.response?.status === 400 && err.response?.data?.message?.includes("find users")) {
          setVideos([])
          setError(null)
        } else {
          setError(err.response?.data?.message || "Failed to load videos")
        }
        setLoading(false)
      })
  }, [])

  return (
    <section className="channel-section">
      <div className="section-title-row">
        <h2 className="section-heading">Subscribed Channel Videos</h2>
      </div>

      {loading ? (
        <p className="video-meta">Loading videos...</p>
      ) : error ? (
        <p className="video-meta">{error}</p>
      ) : videos.length > 0 ? (
        <div className="channel-videos-row">
          {videos.map((video) => (
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
        <p className="video-meta">No videos from subscribed channels yet.</p>
      )}
    </section>
  )
}

export default SubscribedTo