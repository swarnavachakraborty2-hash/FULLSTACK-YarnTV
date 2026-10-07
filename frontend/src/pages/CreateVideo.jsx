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

  // Fetch user playlists when the component loads
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

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideo(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  // Handle thumbnail file selection
  const handleThumbChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  // Submit the form
  const handlePublish = (e) => {
    e.preventDefault()
    
    if (!title) {
      setError('Title is required.')
      return
    }
    if (!video) {
      setError('Please select a video file.')
      return
    }
    
    setError('')
    setUploading(true)

    // Append data to FormData for file upload
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('videoFile', video)
    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    // Call the backend API to create the video
    api.post('video/create-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(res => {
        const videoId = res.data.data._id
        
        // If a playlist was selected, add the video to it
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
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ marginBottom: '20px' }}>Upload Video</h1>
      
      <form onSubmit={handlePublish} style={{ display: 'flex', gap: '40px' }}>
        
        {/* Left Side: Form Inputs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#18181b', color: 'white', border: '1px solid #27272a' }}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
              style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#18181b', color: 'white', border: '1px solid #27272a' }}
            />
          </div>

          {/* Video File Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Video File *</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleVideoChange}
            />
          </div>

          {/* Thumbnail File Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Thumbnail (optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleThumbChange}
            />
            {thumbnailPreview && (
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }} 
              />
            )}
          </div>

          {/* Playlist Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Add to Playlist (optional)</label>
            <select 
              value={selectedPlaylist} 
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#18181b', color: 'white', border: '1px solid #27272a' }}
            >
              <option value="">None</option>
              {playlistOptions.map(playlist => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && <p style={{ color: '#f87171', margin: 0 }}>{error}</p>}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#ae7aff', 
              color: 'black', 
              border: 'none', 
              borderRadius: '5px', 
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Publishing...' : 'Publish Video'}
          </button>
        </div>

        {/* Right Side: Video Preview */}
        <div style={{ width: '400px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Video Preview</label>
          <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#18181b', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {videoPreview ? (
              <video src={videoPreview} controls style={{ width: '100%', height: '100%' }} />
            ) : (
              <p style={{ color: '#71717a' }}>No video selected</p>
            )}
          </div>
        </div>

      </form>
    </div>
  )
}

export default CreateVideo