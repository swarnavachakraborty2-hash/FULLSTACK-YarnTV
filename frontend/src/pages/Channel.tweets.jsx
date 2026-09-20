import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatTimeAgo, formatViews } from "../utils/formatters"
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon } from '../components/Icons'

function ChannelTweets() {

    const navigate = useNavigate()
    const [userId, setUserId] = useState("")
    const [userTweets, setUserTweets] = useState([])

    useEffect(() => {
        api.get("user/curr-user")
            .then((res) => {
                if (res.data) {
                    setUserId(res.data.data._id)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [])

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
    }, [userId, userTweets])


    const onLike = (tweet_id) => {
        api.get(`like/tweet/${tweet_id}`)
            .then((res) => {
               console.log(res.data.message)
            })
            .catch((err) => {
                console.log(err.response.data)
            })
    }

    const onDisLike = (tweet_id) => {
        api.get(`tweet/dislike-tweet-toggle/${tweet_id}`)
            .then((res) => {
                if (res.data.data) {
                    console.log(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }



    return (
        <div className="tweets-list">
            <div className="section-title-row">
                <h2 className="section-heading">My tweets</h2>
            </div>
            {userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                    <div key={tweet._id} className="tweet-card">
                        <img
                            src={tweet.owner?.avatar}
                            alt={tweet.owner?.username}
                            className="tweet-avatar"
                        />
                        <div className="tweet-body">
                            <div className="tweet-header">
                                <span className="tweet-author">{tweet.owner?.username}</span>
                                <span className="tweet-time">{formatTimeAgo(tweet.createdAt)}</span>
                            </div>
                            <p className="tweet-content">{tweet.content}</p>
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