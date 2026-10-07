import React, { useState } from 'react'
import api from "../api/axios"
import { useNavigate } from 'react-router-dom'

function UploadTweet() {
  const [tweet, setTweet] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!tweet.trim()) { setError('Please write something before posting.'); return }
    setError('')
    setPosting(true)
    api.post('tweet/create-tweet', { tweet })
      .then(() => navigate('/channel/tweets'))
      .catch(err => {
        setError(err?.response?.data?.message || 'Failed to post. Please try again.')
        setPosting(false)
      })
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
    setTweet(e.target.value)
    if (error) setError('')
  }

  return (
    <div className="ut-page">

      {/* Header */}
      <div className="ut-header">
        <button className="cv-back-btn" type="button" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="cv-header-title">Create Post</h1>
      </div>

      {/* Compose card */}
      <form className="ut-compose-card" onSubmit={onSubmit}>

        <div className="ut-compose-prompt">What's on your mind?</div>

        <textarea
          className="ut-compose-textarea"
          placeholder="Share an update with your fans…"
          value={tweet}
          onChange={autoResize}
          rows={5}
          maxLength={500}
        />

        <div className="ut-compose-meta">
          <span className="ut-char-count">{tweet.length}/500</span>
          {error && <span className="cv-error">{error}</span>}
          <button
            type="submit"
            className="ut-post-btn"
            disabled={posting || !tweet.trim()}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default UploadTweet