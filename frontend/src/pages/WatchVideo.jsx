import React, { useEffect, useState, useParams } from 'react'
import api from "../api/axios"

function WatchVideo() {
  const [video, setVideo] = useState()
  const [views, setviews] = useState(0)
  const [likes, setLikes] = useState(0)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [liked, setLiked] = useState(true)
  const [subscribers, setSubscribers] = useState([])
  const [subscribed, setSubscribed] = useState(true)
  const [dislikes, setDisLikes] = useState(0)
  const [disliked, setDisLiked] = useState(true)
  const [comments, setComments] = useState([])
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [comment, setComment] = useState("")
  const [myComment, setMycomment] = useState(false)

  const { id } = useParams()


  useEffect(() => {
    api.get(`video/watch-video/${id}`)
      .then((res) => {
        console.log(res.data.message)
      })
  }, [id])

  useEffect(() => {
    api.get(`video/get-video/${id}`)
      .then((res) => {
        if (res.data.data) {
          setVideo(res.data.data.videoFile)
          setviews(res.data.data.views)
          setDisLikes(res.data.data.dislikes)
          setLikes(res.data.data.likes)
          setDisLiked(res.data.data.isDisliked)
          setLiked(res.data.data.isLiked)
          setSubscribers(res.data.data.owner.subscribers)
          setSubscribed(res.data.data.owner.isSubscribed)
          setTitle(res.data.data.title)
          setDesc(res.data.data.description)
          setUsername(res.data.data.owner.username)
          setAvatar(res.data.data.owner.avatar)
        }
      })
  }, [id, liked, subscribers, comments, disliked])

  useEffect(() => {
    api.get(`video/get-comments-video/${id}`)
      .then((res) => {
        setComments(res.data.data)
      })
  }, [video])

  useEffect(() => {
    api.get("video/get-feed-videos")
      .then((res) => {
        setVideos(res.data.data)
      })
  }, [video])


  const onSubscribe = () => {
    api.get(`subscription/${username}`)
      .then((res) => {
        setSubscribed(res.data.data.isSubscribed)
        setSubscribers(res.data.data.subscribers)
      })
  }


  const onLike = () => {
    api.get(`like/video/${id}`)
      .then((res) => {
        setLiked(res.data.data.isLiked)
        setLikes()
      })
  }


  const onDislike = () => {
    api.get(`video/dislike-video-toggle/${id}`)
      .then((res) => {
        setDisLiked(res.data.data.isDisliked)
        setDisLikes(res.data.data.dislikes)
      })
  }


  const onCommentSubmit = (e) => {
    e.preventDefault()
    api.post(`video/comment-video/${id}`,{comment})
    .then((res)=>{
      setComments(res.data.data)
    })
  }


  const onLikeComment = (comment_id) => {
    api.get(`like/comment/${comment_id}`)
      .then((res) => {
        setComments((prevComments) => {
          prevComments.map((prevComment) => {
            (prevComment._id === comment_id) ?
              { ...prevComment, likes: res.data.data.likes, isLiked: res.data.data.isLiked } :
              prevComment
          })
        })
      })
  }

  const onDeleteComment = (comment_id) => {
    api.delete(`video/delete-comment-video/${id}/${comment_id}`)
    .then((res)=>{
      setComments(res.data.data)
    })
  }



  return (
    <div>WatchVideo</div>
  )
}

export default WatchVideo