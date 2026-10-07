import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"

function CreateVideo() {
  const [video, setVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const [playlistOptions, setPlaylistOptions] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    api.get('/user/curr-user')
      .then(res => {
        const userId = res.data.data._id
        api.get(`/playlist/get-currentUser-playlists-options/${userId}`)
          .then(r => setPlaylistOptions(r.data.data || []))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [])

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideo(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handlePublish = (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!video) {
      setError('Please select a video file.')
      return
    }
    
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('videoFile', video)
    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    api.post('video/create-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(res => {
        const videoId = res.data.data._id
        if (selectedPlaylist) {
          api.get(`playlist/save-video-playlist/${selectedPlaylist}/${videoId}`)
            .catch(err => console.log(err))
        }
        setUploading(false)
        navigate('/channel')
      })
      .catch(err => {
        setUploading(false)
        setError(err?.response?.data?.message || 'Upload failed. Please try again.')
      })
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)}
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Upload Video</h1>
      </div>
      
      <form onSubmit={handlePublish} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Form Inputs */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-group">
            <label className="form-label">Title <span style={{ color: '#f87171' }}>*</span></label>
            <input 
              className="form-input"
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title that describes your video"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video..."
              rows={5}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video File <span style={{ color: '#f87171' }}>*</span></label>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '9px' }}>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleVideoChange}
                style={{ color: 'var(--text-secondary)', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail (optional)</label>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '9px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleThumbChange}
                style={{ color: 'var(--text-secondary)', width: '100%' }}
              />
              {thumbnailPreview && (
                <div style={{ marginTop: '16px' }}>
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    style={{ width: '100%', maxWidth: '240px', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Add to Playlist (optional)</label>
            <select 
              className="form-input"
              value={selectedPlaylist} 
              onChange={(e) => setSelectedPlaylist(e.target.value)}
            >
              <option value="">None</option>
              {playlistOptions.map(playlist => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>}

          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              padding: '12px 32px', 
              backgroundColor: 'var(--accent-purple)', 
              color: '#09090b', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '700',
              fontSize: '15px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
              alignSelf: 'flex-start',
              marginTop: '8px'
            }}
          >
            {uploading ? 'Publishing...' : 'Publish Video'}
          </button>
        </div>

        {/* Right Side: Video Preview */}
        <div style={{ width: '360px', flexShrink: 0 }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>Video Preview</label>
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)',
            borderRadius: '12px', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {videoPreview ? (
              <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
                  <rect x="4" y="8" width="40" height="32" rx="4" />
                  <polygon points="20 18 32 24 20 30 20 18" fill="currentColor" stroke="none" opacity="0.4" />
                </svg>
                <span style={{ fontSize: '14px' }}>No video selected</span>
              </div>
            )}
          </div>
          
          {video && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Filename</span>
                <span style={{ color: 'var(--text-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Size</span>
                <span style={{ color: 'var(--text-primary)' }}>{(video.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}
        </div>

      </form>
    </div>
  )
}

export default CreateVideo