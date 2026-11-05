import React, { useEffect, useState, useCallback } from 'react'
import VideoCard from '../components/VideoCard'
import api, { apiCall } from '../api/axios'

function Feed() {
  const [videos, setVideos] = useState([])

  const fetchVideos = useCallback(async () => {
    try {
      // cache-bust so browser always gets fresh data from the server
      const res = await apiCall(() => api.get(`/video/get-feed-videos?_=${Date.now()}`))
      if (res.data?.data) {
        setVideos(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err)
    }
  }, [])

  // Fetch on first mount
  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // Re-fetch whenever the user switches back to this tab (e.g. after uploading)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchVideos()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [fetchVideos])

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
            id={video._id}
            layout="grid"
          />
        ))}
      </div>
    </main>
  )
}

export default Feed
