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
    api.post('tweet/create-tweet', { content: tweet })
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
    <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 24px', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)}
          type="button"
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '8px',
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create Post</h1>
      </div>

      {/* Compose card */}
      <form onSubmit={onSubmit} style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>

        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>What's on your mind?</div>

        <textarea
          placeholder="Share an update with your fans..."
          value={tweet}
          onChange={autoResize}
          rows={4}
          maxLength={500}
          style={{ 
            width: '100%', 
            backgroundColor: 'transparent', 
            border: 'none', 
            outline: 'none', 
            color: 'var(--text-primary)', 
            fontSize: '16px', 
            fontFamily: 'inherit',
            lineHeight: '1.6', 
            resize: 'none', 
            minHeight: '100px'
          }}
        />

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border-color)' 
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>{tweet.length}/500</span>
          
          {error && <span style={{ fontSize: '13px', color: '#f87171' }}>{error}</span>}
          
          <button
            type="submit"
            disabled={posting || !tweet.trim()}
            style={{ 
              backgroundColor: 'var(--accent-purple)', 
              color: '#09090b', 
              fontSize: '14px', 
              fontWeight: '700', 
              padding: '10px 24px', 
              borderRadius: '8px', 
              cursor: (posting || !tweet.trim()) ? 'not-allowed' : 'pointer',
              border: 'none',
              opacity: (posting || !tweet.trim()) ? 0.5 : 1
            }}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default UploadTweet