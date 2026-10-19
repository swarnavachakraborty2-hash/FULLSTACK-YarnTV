import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api/axios"

function Admin() {

  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [avatar, setAvatar] = useState("")

  const [totalVideos, setTotalVideos] = useState(0)
  const [videos, setVideos] = useState([])
  const [subscribers, setSubscribers] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [err, setErr] = useState("")

  useEffect(() => {
    api.get(`/video/get-admin-stats`)
      .then((res) => {
        setAvatar(res.data.data.avatar)
        setUsername(res.data.data.username)
        setFullname(res.data.data.fullname)
        setTotalLikes(res.data.data.totalLikes)
        setSubscribers(res.data.data.subscribers)
        setTotalViews(res.data.data.totalViews)
      })
      .catch((err) => {
        if (err?.response.data) {
          setErr(err.response.data)
        }
      })
  }, [])



  useEffect(() => {
    api.get("/video/get-admin-videos")
      .then((res) => {
        setTotalVideos(res.data.data.createdVideos.length)
        setVideos(res.data.data.createdVideos) //show all the list of videos
      })
      .catch((err) => {
        if (err?.response.data) {
          setErr(err.response.data)
        }
      })
  }, [username])

  const onDelete = (v_id) => {
    api.delete(`video/delete-video/${v_id}`)
      .then((res) => {
        setVideos((videos) => {
          videos.filter((prev_video) => {
            prev_video._id != v_id.toString()
          })
        })
      })
      .catch((err) => {
        if (err?.response.data) {
          setErr(err.response.data)
        }
      })
  }

  const onPublishToggle = (v_id) => {
    api.get(`video/publish-toggle-video/${v_id}`)
      .then((res) => {
        setVideos((videos) => {
          videos.map((prev_video) => {
            prev_video._id === v_id ? { ...prev_video, isPublished: res.data.data.isPublished } : prev_video
          })
        })
      })
      .catch((err) => {
        if (err?.response.data) {
          setErr(err.response.data)
        }
      })
  }

  const onUpdateVideo = (v_id) => {
    api.patch(``)
  }

  return (
    <main className="feed-content" style={{ padding: '28px 36px', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Statistics</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Welcome to your creator dashboard.</p>
      </div>
    </main>
  )
}

export default Admin
