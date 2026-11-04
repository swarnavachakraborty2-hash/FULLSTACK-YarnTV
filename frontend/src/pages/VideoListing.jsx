import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { apiCall } from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"
import VideoCard from '../components/VideoCard'

function VideoListing() {

    const { title } = useParams()
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])

    useEffect(() => {
        if (!title) return

        apiCall(() => api.post(`video/search-video/${title}`)
            .then((res) => {
                if (res.data) {
                    setVideos(res.data.data)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            }))
    }, [title])

    return (
        <div className="feed-content">
            {videos.length > 0 ? (
                <>
                    {/* Desktop Search Results: exactly the same layout for computer */}
                    <div className="search-results-desktop">
                        <div className="videos-list">
                            {videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="video-card-list video-card-list--large"
                                    onClick={() => navigate(`/watch/${video._id}`)}
                                >
                                    <div className="thumbnail-wrapper-list">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="thumbnail-img"
                                        />
                                        <span className="duration-badge">{formatDuration(video.duration)}</span>
                                    </div>
                                    <div className="video-info-list">
                                        <h3 className="video-title-list">{video.title}</h3>
                                        <p className="video-meta">
                                            {formatViews(video.views)} Views · {formatTimeAgo(video.createdAt)}
                                        </p>
                                        <div className="channel-row">
                                            <img
                                                src={video.owner?.avatar}
                                                alt={video.owner?.username}
                                                className="channel-avatar-sm"
                                            />
                                            <span className="channel-name">{video.owner?.username}</span>
                                        </div>
                                        <p className="video-description">{video.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Search Results: exactly like the feed page on mobile */}
                    <div className="search-results-mobile">
                        <div className="videos-grid">
                            {videos.map((video) => (
                                <VideoCard
                                    key={video._id}
                                    title={video.title}
                                    thumbnail={video.thumbnail}
                                    duration={video.duration}
                                    views={video.views}
                                    createdAt={video.createdAt}
                                    channelName={video.owner?.username}
                                    channelAvatar={video.owner?.avatar}
                                    description={video.description}
                                    id={video._id}
                                    layout="grid"
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p className="video-meta" style={{ padding: '24px 16px' }}>No videos found for "{title}".</p>
            )}
        </div>
    )
}

export default VideoListing
