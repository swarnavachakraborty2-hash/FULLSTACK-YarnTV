import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { formatTimeAgo } from '../utils/formatters'

function TweetsComments() {

    const [comments, setComments] = useState([])
    const { tweet_id } = useParams()
    const [comment, setComment] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`tweet/get-comments-tweet/${tweet_id}`)
            .then((res) => {
                setComments(res.data.data)
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [tweet_id])

    const onLikeComment = (comment_id) => {
        api.get(`like/comment/${comment_id}`)
            .then((res) => {
                setComments((prevComments) =>
                    prevComments.map((c) =>
                        c._id === comment_id
                            ? { ...c, likes: res.data.data.likes, isLiked: res.data.data.isLiked }
                            : c
                    )
                )
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    const onCommentSubmit = (e) => {
        e.preventDefault()
        api.post(`tweet/comment-tweet/${tweet_id}`, { comment })
            .then((res) => {
                setComments(res.data.data)
                setComment("")
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    const onDeleteComment = (comment_id) => {
        api.delete(`tweet/delete-comment-tweet/${tweet_id}/${comment_id}`)
            .then((res) => {
                setComments(res.data.data)
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    return (
        <div className="feed-content">
            <div className="comments-page">
                <h2 className="comments-page-heading">{comments.length} Comments</h2>

                <form className="comments-page-form" onSubmit={onCommentSubmit}>
                    <input
                        type="text"
                        className="comments-page-input"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" className="comments-page-submit" disabled={!comment.trim()}>
                        Post
                    </button>
                </form>

                {comments.length > 0 ? (
                    <div className="comments-page-list">
                        {comments.map((c) => (
                            <div key={c._id} className="comments-page-card">
                                {c.owner?.avatar ? (
                                    <img
                                        src={c.owner.avatar}
                                        alt={c.owner.username}
                                        className="comments-page-avatar"
                                        onClick={() => navigate(`/profile/${c.owner?.username}`)}
                                    />
                                ) : (
                                    <div
                                        className="comments-page-avatar comments-page-avatar--placeholder"
                                        onClick={() => navigate(`/profile/${c.owner?.username}`)}
                                    >
                                        {c.owner?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="comments-page-body">
                                    <div className="comments-page-header">
                                        <span
                                            className="comments-page-author"
                                            onClick={() => navigate(`/profile/${c.owner?.username}`)}
                                        >
                                            {c.owner?.username}
                                        </span>
                                        <span className="comments-page-time">· {formatTimeAgo(c.createdAt)}</span>
                                    </div>

                                    <p className="comments-page-text">{c.content}</p>

                                    <div className="comments-page-actions">
                                        <button
                                            type="button"
                                            className={`comments-page-like-btn${c.isLiked ? ' comments-page-like-btn--liked' : ''}`}
                                            onClick={() => onLikeComment(c._id)}
                                        >
                                            <svg viewBox="0 0 24 24" className="comments-page-like-icon" fill="currentColor">
                                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                                            </svg>
                                            <span>{c.likes ?? 0}</span>
                                        </button>

                                        {c.isMyComment && (
                                            <button
                                                type="button"
                                                className="comments-page-delete-btn"
                                                onClick={() => onDeleteComment(c._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="comments-page-empty">No comments yet.</p>
                )}
            </div>
        </div>
    )
}

export default TweetsComments