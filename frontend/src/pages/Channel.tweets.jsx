import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from "../api/axios"
import { formatTimeAgo, formatViews } from "../utils/formatters"
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon } from '../components/Icons'

function ChannelTweets() {

    const { name } = useParams()
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
                    setUserTweets(res.data.data)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [userId])

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
        <div className="feed-tweets-container centered">
            {userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                    <div key={tweet._id} className="feed-tweet-card">
                        <img
                            src={tweet.owner?.avatar}
                            alt={tweet.owner?.username}
                            className="feed-tweet-avatar"
                        />
                        <div className="feed-tweet-main">
                            <div className="feed-tweet-header">
                                <span className="feed-tweet-fullname">
                                    {tweet.owner?.fullname || tweet.owner?.username}
                                </span>
                                <span className="feed-tweet-meta">
                                    @{tweet.owner?.username} · {formatTimeAgo(tweet.createdAt)}
                                </span>
                            </div>

                            <p className="feed-tweet-content">{tweet.content}</p>

                            <div className="tweet-actions">
                                <div onClick={() => onLike(tweet._id)} className={`tweet-action-btn ${tweet.isLiked ? 'liked' : ''}`}>
                                    <ThumbsUpIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.likes)}</span>
                                </div>
                                <div onClick={() => onDisLike(tweet._id)} className={`tweet-action-btn ${tweet.isDisliked ? 'liked' : ''}`}>
                                    <ThumbsDownIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.dislikes)}</span>
                                </div>
                                <div className="tweet-action-btn">
                                    <CommentIcon className="tweet-action-icon" />
                                    <span>{formatViews(tweet.comments)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="video-meta">No tweets yet.</p>
            )}
        </div>
    )
}

export default ChannelTweets