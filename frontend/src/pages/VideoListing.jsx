import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function VideoListing() {

    const { title } = useParams()
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])

    useEffect(() => {
        if (!title) return

        api.post(`video/search-video/${title}`)
            .then((res) => {
                if (res.data) {
                    setVideos(res.data.data)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [title])

    return (
        <div className="feed-content">
            {videos.length > 0 ? (
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
            ) : (
                <p className="video-meta">No videos found for "{title}".</p>
            )}
        </div>
    )
}

export default VideoListing