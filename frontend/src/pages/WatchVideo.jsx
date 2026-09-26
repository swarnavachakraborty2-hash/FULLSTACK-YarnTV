import React, { useState } from 'react'

function WatchVideo() {
    const [video, setVideo] = useState("")
    const [views, setviews] = useState(0)
    const [likes, setLikes] = useState(0)
    const [videoOwner, setVideoOwner] = useState({})
    const [liked, setLiked] = useState(true)
    const [subscribers, setSubscribers] = useState([])
    const [subscribed, setsubscribed] = useState(true)
    const [dislikes, setDisLikes] = useState(0)
    const [disliked, setDisLiked] = useState(true)
    const [comments, setComments] = useState([])
    const [videos, setVideos] = useState([])

  return (
    <div>WatchVideo</div>
  )
}

export default WatchVideo