import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"

function Channel() {
    const navigate = useNavigate()
    const { name } = useParams()
    const [username, setUsername] = useState("")
    const [videos, setVideos] = useState([])

    useEffect(() => {
        if (name) {
            setUsername(name)
        } else {
            api.get("user/curr-user")
                .then((res) => {
                    if (res.data) {
                        setUsername(res.data.data.username)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        }
    }, [name])

    useEffect(() => {
        if (!username) return

        api.get(`video/get-user-videos/${username}`)
            .then((res) => {
                if (res.data) {
                    setVideos(res.data.data.createdVideos)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [username])

    return (
        <section className="channel-section">
            <div className="section-title-row">
                <h2 className="section-heading">{name ? `Videos` : `My videos`}</h2>
                <button type="button" className="btn-see-all">See all</button>
            </div>

            {videos.length > 0 ? (
                <div className="channel-videos-row">
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            className="channel-video-card"
                            onClick={() => navigate(`/watch/${video._id}`)}
                        >
                            <div className="channel-video-thumb">
                                <img src={video.thumbnail} alt={video.title} />
                                <span className="duration-badge">{formatDuration(video.duration)}</span>
                            </div>
                            <div className="channel-video-meta">
                                <h3 className="video-title-grid">{video.title}</h3>
                                <p className="channel-name">{video.owner?.username}</p>
                                <p className="video-meta">
                                    {formatViews(video.views)} views · {formatTimeAgo(video.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="video-meta">No videos yet.</p>
            )}
        </section>
    )
}

export default Channel