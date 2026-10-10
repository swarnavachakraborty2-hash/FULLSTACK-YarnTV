import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatTimeAgo, formatViews } from "../utils/formatters"
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon } from '../components/Icons'

function ChannelTweets() {

    const { name } = useParams()
    const navigate = useNavigate()
    const [userId, setUserId] = useState("")
    const [userTweets, setUserTweets] = useState([])

    useEffect(() => {
        if (name) {
            api.get(`user/profile/${name}`)
                .then((res) => {
                    if (res.data) {
                        setUserId(res.data.data._id)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        } else {
            api.get("user/curr-user")
                .then((res) => {
                    if (res.data) {
                        setUserId(res.data.data._id)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        }
    }, [name])

    useEffect(() => {
        if (!userId) return

        api.get(`tweet/get-user-tweets/${userId}`)
            .then((res) => {
                if (res.data) {
                    let tweets = res.data.data || []
                    tweets = tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    setUserTweets(tweets)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [userId])

    const [currUserId, setCurrUserId] = useState(null)

    useEffect(() => {
        api.get("user/curr-user").then((res) => {
            if (res.data?.data?._id) {
                setCurrUserId(res.data.data._id)
            }
        }).catch(() => {})
    }, [])

    const onDelete = (tweet_id) => {
        api.delete(`tweet/delete-tweet/${tweet_id}`)
            .then(() => {
                setUserTweets(prev => prev.filter(t => t._id !== tweet_id))
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    const onLike = (tweet_id) => {
        api.get(`like/tweet/${tweet_id}`)
            .then((res) => {
                if (res.data.data) {
                    const updated = res.data.data
                    setUserTweets((prev) =>
                        prev.map((t) =>
                            t._id === tweet_id
                                ? { ...t, isLiked: updated.isLiked, likes: updated.likes }
                                : t
                        )
                    )
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    const onDisLike = (tweet_id) => {
        api.get(`tweet/dislike-tweet-toggle/${tweet_id}`)
            .then((res) => {
                if (res.data.data) {
                    const updated = res.data.data
                    setUserTweets((prev) =>
                        prev.map((t) =>
                            t._id === tweet_id
                                ? { ...t, isDisliked: updated.isDisliked, dislikes: updated.dislikes }
                                : t
                        )
                    )
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
            {userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                    <div 
                        key={tweet._id} 
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '20px',
                            display: 'flex',
                            gap: '14px',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            position: 'relative'
                        }}
                    >
                        {/* Delete Button */}
                        {currUserId === tweet.owner?._id && (
                            <button
                                onClick={() => onDelete(tweet._id)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    transition: 'color 0.2s ease, background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#f87171'
                                    e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-muted)'
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}

                        {/* Avatar */}
                        {tweet.owner?.avatar ? (
                            <img
                                src={tweet.owner.avatar}
                                alt={tweet.owner.username}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-purple)',
                                color: '#09090b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                flexShrink: 0
                            }}>
                                {tweet.owner?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}

                        {/* Tweet Main Body */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            
                            {/* Header (Name, Handle, Time) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                                    {tweet.owner?.fullname || tweet.owner?.username}
                                </span>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    @{tweet.owner?.username} • {formatTimeAgo(tweet.createdAt)}
                                </span>
                            </div>

                            {/* Content */}
                            <p style={{ 
                                fontSize: '15px', 
                                lineHeight: '1.6', 
                                color: 'var(--text-primary)', 
                                margin: 0, 
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word'
                            }}>
                                {tweet.content}
                            </p>

                            {/* Action Bar */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                marginTop: '4px',
                                paddingTop: '8px'
                            }}>
                                {/* Like Button */}
                                <button 
                                    onClick={() => onLike(tweet._id)} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: tweet.isLiked ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                                        backgroundColor: tweet.isLiked ? 'rgba(174, 122, 255, 0.12)' : 'var(--bg-surface)',
                                        color: tweet.isLiked ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <ThumbsUpIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.likes)}</span>
                                </button>

                                {/* Dislike Button */}
                                <button 
                                    onClick={() => onDisLike(tweet._id)} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: tweet.isDisliked ? '1px solid #f87171' : '1px solid var(--border-color)',
                                        backgroundColor: tweet.isDisliked ? 'rgba(248, 113, 113, 0.12)' : 'var(--bg-surface)',
                                        color: tweet.isDisliked ? '#f87171' : 'var(--text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <ThumbsDownIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.dislikes)}</span>
                                </button>

                                {/* Comments Button */}
                                <button 
                                    onClick={() => navigate(`/${tweet._id}/comments`)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-surface)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <CommentIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.comments)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <p style={{ margin: 0, fontSize: '15px' }}>No tweets yet.</p>
                </div>
            )}
        </div>
    )
}

export default ChannelTweets