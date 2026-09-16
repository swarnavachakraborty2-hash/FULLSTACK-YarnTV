import React from 'react'
import { formatViews, formatDuration, formatTimeAgo } from '../utils/formatters'

function VideoCard({
  title,
  thumbnail,
  duration,
  views,
  createdAt,
  channelName,
  channelAvatar,
  description,
  layout = 'grid'
}) {
  const formattedDuration = formatDuration(duration)
  const formattedViews = formatViews(views)
  const formattedTimeAgo = formatTimeAgo(createdAt)

  if (layout === 'list') {
    return (
      <article className="video-card-list">
        {/* Thumbnail on Left */}
        <div className="thumbnail-wrapper-list">
          <img src={thumbnail} alt={title} className="thumbnail-img" />
          <span className="duration-badge">{formattedDuration}</span>
        </div>

        {/* Video Info on Right */}
        <div className="video-info-list">
          <h3 className="video-title-list">{title}</h3>
          <p className="video-meta">
            <span>{formattedViews} views</span>
            <span className="dot-separator">·</span>
            <span>{formattedTimeAgo}</span>
          </p>

          <div className="channel-row">
            <img src={channelAvatar} alt={channelName} className="channel-avatar-sm" />
            <span className="channel-name">{channelName}</span>
          </div>

          {description && (
            <p className="video-description">{description}</p>
          )}
        </div>
      </article>
    )
  }

  // Default: Grid Card (Image 2)
  return (
    <article className="video-card-grid">
      {/* Thumbnail */}
      <div className="thumbnail-wrapper-grid">
        <img src={thumbnail} alt={title} className="thumbnail-img" />
        <span className="duration-badge">{formattedDuration}</span>
      </div>

      {/* Video Details below thumbnail */}
      <div className="video-details-grid">
        <img src={channelAvatar} alt={channelName} className="channel-avatar" />
        <div className="video-meta-block">
          <h3 className="video-title-grid" title={title}>
            {title}
          </h3>
          <p className="video-meta">
            <span>{formattedViews} views</span>
            <span className="dot-separator">·</span>
            <span>{formattedTimeAgo}</span>
          </p>
          <p className="channel-name">{channelName}</p>
        </div>
      </div>
    </article>
  )
}

export default VideoCard
