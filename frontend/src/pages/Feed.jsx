import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import api from '../api/axios'

function Feed() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    async function fetchVideos() {
      try {
       
        const res = await api.get('/video/get-feed-videos')
        if (res.data?.data) {
          setVideos(res.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch videos:', err)
      }
    }

    fetchVideos() 
  }, [])

  return (
    <main className="feed-content">
      <div className="videos-grid">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            title={video.title}
            thumbnail={video.thumbnail}
            duration={video.duration}
            views={video.views}
            createdAt={video.createdAt}
            channelName={video.owner?.username}
            channelAvatar={video.owner?.avatar}
            description={video.description}
            layout="grid"
          />
        ))}
      </div>
    </main>
  )
}

export default Feed