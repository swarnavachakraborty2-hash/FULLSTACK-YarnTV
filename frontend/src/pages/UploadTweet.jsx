import React, { useState } from 'react'
import api from "../api/axios"
import { Navigate, useNavigate } from 'react-router-dom'


function UploadTweet() {

  const [tweet, setTweet] = useState("")
  const navigate = useNavigate()

  const onSubmit = () => {
    api.post("tweet/create-tweet", { tweet })
      .then(() => navigate("/channel/tweets"))
      .catch((err) => { console.log(err.response.data) })
  }

  return (
    <div>UploadTweet</div>
  )
}

export default UploadTweet