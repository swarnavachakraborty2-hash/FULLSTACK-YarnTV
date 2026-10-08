import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function Liked() {
    const navigate = useNavigate()
    const [liked, setLiked] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("video/get-liked-videos")
            .then((res) => {
                if (res.data) {
                    setLiked(res.data.data)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err.response?.data)
                setLoading(false)
            })
    }, [])

    const firstVideo = liked[0]?.video

    return (
        <main className="feed-content" style={{ padding: '28px 36px', height: '100%', overflowY: 'auto' }}>
            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading liked videos...</p>
            ) : liked.length > 0 ? (
                <div style={{ display: 'flex', gap: '32px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    
                    {/* Left Sidebar Playlist Hero Card */}
                    <div style={{ 
                        width: '340px', 
                        flexShrink: 0, 
                        background: 'linear-gradient(180deg, rgba(174, 122, 255, 0.16) 0%, var(--bg-card) 70%)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '24px',
                        position: 'sticky',
                        top: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        {/* Preview Thumbnail */}
                        <div style={{ 
                            width: '100%', 
                            aspectRatio: '16/9', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            position: 'relative',
                            backgroundColor: '#000',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            {firstVideo?.thumbnail ? (
                                <img src={firstVideo.thumbnail} alt="Liked playlist cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent-purple)' }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '48px', height: '48px' }}>
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Title & Stats */}
                        <div>
                            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                                Liked Videos
                            </h1>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {liked.length} {liked.length === 1 ? 'video' : 'videos'}
                            </p>
                        </div>

                        {/* Play All Button */}
                        {firstVideo && (
                            <button
                                onClick={() => navigate(`/watch/${firstVideo._id}`)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: 'var(--accent-purple)',
                                    color: '#09090b',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 15px rgba(174, 122, 255, 0.3)'
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Play All
                            </button>
                        )}
                    </div>

                    {/* Right Side Video List (Spans full remaining width) */}
                    <div style={{ flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {liked.map((item, index) => {
                            const video = item.video
                            if (!video) return null
                            return (
                                <div
                                    key={item._id || index}
                                    onClick={() => navigate(`/watch/${video._id}`)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '14px 18px',
                                        borderRadius: '14px',
                                        backgroundColor: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'
                                        e.currentTarget.style.borderColor = 'var(--border-hover)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-card)'
                                        e.currentTarget.style.borderColor = 'var(--border-color)'
                                    }}
                                >
                                    {/* Index Number */}
                                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-muted)', width: '28px', textAlign: 'center' }}>
                                        {index + 1}
                                    </span>

                                    {/* Thumbnail */}
                                    <div style={{ width: '160px', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, backgroundColor: '#000' }}>
                                        <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span className="duration-badge">{formatDuration(video.duration)}</span>
                                    </div>

                                    {/* Video Meta Info */}
                                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {video.title}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {video.owner?.avatar && (
                                                <img src={video.owner.avatar} alt={video.owner.username} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                                            )}
                                            <span>{video.owner?.username || 'Channel'}</span>
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                            {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                                        </p>
                                    </div>

                                    {/* Liked Heart Icon */}
                                    <div style={{ padding: '8px', color: 'var(--accent-purple)', flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '22px', height: '22px' }}>
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px', color: 'var(--accent-purple)', opacity: 0.6 }}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No liked videos yet</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>Videos you like will show up here as a collection.</p>
                </div>
            )}
        </main>
    )
}

export default Liked