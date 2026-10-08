import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function History() {
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("video/get-watched-videos")
            .then((res) => {
                if (res.data) {
                    setVideos(res.data.data)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err.response?.data)
                setLoading(false)
            })
    }, [])

    return (
        <main className="feed-content" style={{ padding: '28px 36px', height: '100%', overflowY: 'auto' }}>
            
            {/* Top Bar Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '12px', 
                        backgroundColor: 'var(--bg-card)', 
                        border: '1px solid var(--border-color)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--accent-purple)'
                    }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Watch History</h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                            {videos.length} {videos.length === 1 ? 'video watched' : 'videos watched'}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading watch history...</p>
            ) : videos.length > 0 ? (
                /* Grid of Cards */
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '24px' 
                }}>
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            onClick={() => navigate(`/watch/${video._id}`)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.borderColor = 'var(--accent-purple)'
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = 'var(--border-color)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            {/* Thumbnail Container with Watched Bar */}
                            <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', backgroundColor: '#000' }}>
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <span className="duration-badge">{formatDuration(video.duration)}</span>
                                
                                {/* Watched Progress Indicator Bar */}
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    left: 0, 
                                    right: 0, 
                                    height: '4px', 
                                    backgroundColor: 'rgba(255,255,255,0.2)' 
                                }}>
                                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--accent-purple)' }} />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: '16px', display: 'flex', gap: '12px', flex: 1 }}>
                                {video.owner?.avatar && (
                                    <img 
                                        src={video.owner.avatar} 
                                        alt={video.owner.username} 
                                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }} 
                                    />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ 
                                        fontSize: '15px', 
                                        fontWeight: '600', 
                                        color: 'var(--text-primary)', 
                                        margin: '0 0 6px 0',
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {video.title}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 2px 0' }}>
                                        {video.owner?.username || 'Channel'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                        {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '36px', height: '36px', color: 'var(--accent-purple)', opacity: 0.6 }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No watch history</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>Videos you watch will show up here.</p>
                </div>
            )}
        </main>
    )
}

export default History