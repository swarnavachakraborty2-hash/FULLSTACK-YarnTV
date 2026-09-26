import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { formatViews, formatDuration, formatTimeAgo } from '../utils/formatters'

function PlaylistVideos() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        api.get(`/playlist/get-playlist-videos/${id}`)
            .then((res) => {
                if (res.data?.data) {
                    setPlaylist(res.data.data)
                } else {
                    setPlaylist(null)
                }
            })
            .catch((err) => {
                console.error("Error fetching playlist videos:", err)
                setPlaylist(null)
            })
            .finally(() => {
                setLoading(false)
            })
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

    const videos = playlist.videos || []

    return (
        <div className="feed-content">
            <div className="playlist-page">

                {/* Left: Playlist Details Column */}
                <div className="playlist-details-col">
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
                        <h1 className="playlist-details-title">{playlist.name}</h1>

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

                {/* Right: Videos List Column */}
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
                                            if (video.owner?.username) {
                                                navigate(`/profile/${video.owner.username}`)
                                            }
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