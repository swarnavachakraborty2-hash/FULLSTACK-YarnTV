import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatTimeAgo } from "../utils/formatters"
import { ThumbsUpIcon } from '../components/Icons'

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
    }, [userId])

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
                                <div className={`tweet-action-btn ${tweet.isLiked ? 'liked' : ''}`}>
                                    <ThumbsUpIcon className="tweet-action-icon" />
                                    <span>{tweet.likes}</span>
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