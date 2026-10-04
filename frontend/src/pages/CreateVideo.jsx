import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"

function CreateVideo() {
  const [video, setVideo] = useState("")
  const [preview, setPreview] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [playlistOptions, setPlaylistOptions] = useState([])
  const [video_id, setVideo_id] = useState()
  const [id, setId] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/user/curr-user")
      .then((res) => {
        setId(res.data.data._id)
      })
      .catch((err) => { console.log(err.response.data) })
  }, [id])

  const onSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    api.post("video/create-video", { formData })
      .then((res) => {
        setPreview(res.data.data.videoFile)
        setVideo_id(res.data.data._id)
        navigate("/channel")
      })
      .catch((err) => { console.log(err.response.data) })
  }

  const onClickAddToPlaylist = () => {
    setShowDropdown(true)
    api.get(`playlist/get-currentUser-playlists-options/${id}`)
      .then((res) => {
        setPlaylistOptions(res.data.data)
        navigate("/channel")
      })
      .catch((err) => { console.log(err.response.data) })
  }

  const onClickPlaylistOption = (p_id) => {
    api.get(`playlist/save-video-playlist/${p_id}/${video_id}`)
      .then(() => {
        setShowDropdown(false)
        navigate("/channel")
      })
      .catch((err) => { console.log(err.response.data) })
  }

  return (
    <div>CreateVideo</div>
  )
}

export default CreateVideo