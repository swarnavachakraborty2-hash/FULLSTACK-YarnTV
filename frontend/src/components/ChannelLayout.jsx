
import { Outlet } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import { formatViews, formatDuration, formatTimeAgo } from "../utils/formatters"


function ChannelLayout() {

    const [userId, setUserId] = useState("")
    const [activeTab, setActiveTab] = useState("videos")
    const [avatar, setAavatar] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [subscribers, setSubscribers] = useState(0)
    const [subscribedTo, setSubscribedTo] = useState(0)
    const [totalVideos, setTotalVideos] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        api.get("user/curr-user")
            .then((res) => {
                if (res.data) {
                    setUserId(res.data.data._id)
                    setAavatar(res.data.data.avatar)
                    setCoverImage(res.data.data.coverImage)
                    setUsername(res.data.data.username)
                    setFullname(res.data.data.fullname)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [])

    useEffect(() => {
        if(activeTab == 'videos'){
            navigate("/channel")
        }
        else if(activeTab== 'playlist'){
            navigate("/channel/playlists")
        }
        else if(activeTab == 'tweets'){
            navigate("/channel/tweets")
        }
        else{
            navigate("/channel/subscribed")
        }

    }, [activeTab])

    useEffect(() => {
        api.get(`user/profile/${username}`)
            .then((res) => {
                if (res.data) {
                    setSubscribers(res.data.data.subscribersCount)
                    setSubscribedTo(res.data.data.subcsribedToCount)
                    setTotalVideos(res.data.data.videos)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [username])

    return (
        <main className="channel-content">
            {/* Banner Image */}
            < div className="channel-banner" >
                {
                    coverImage ? (
                        <img src={coverImage} alt="Channel banner" />
                    ) : (
                        <div className="channel-banner-placeholder" />
                    )
                }
            </div >

            {/* Channel Header / Profile info */}
            < section className="channel-header" >
                <div className="channel-avatar-large">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={username}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span>{username?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div className="channel-info">
                    <h1 className="channel-display-name">{fullname || username}</h1>
                    <p className="channel-handle">@{username} · View channel</p>
                    <p className="channel-stats">
                        {formatViews(subscribers)} Subscribers · {formatViews(subscribedTo)} Subscribed · {totalVideos} Videos
                    </p>
                    <div className="channel-actions-row">
                        <button type="button" className="btn-channel-edit">
                            Customize channel
                        </button>
                        <button type="button" className="btn-channel-manage">
                            Manage videos
                        </button>
                    </div>
                </div>
            </section >

            {/* Channel Tabs */}
            <div className="channel-tabs">
                <div
                    className={`channel-tab ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("videos")
                        navigate("/channel")
                    }}
                >
                    Videos
                </div>
                <div
                    className={`channel-tab ${activeTab === "playlist" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("playlist")
                    }}
                >
                    Playlists
                </div>
                <div
                    className={`channel-tab ${activeTab === "tweets" ? "active" : ""}`}
                    onClick={() => setActiveTab("tweets")}
                >
                    Tweets
                </div>
                <div
                    className={`channel-tab ${activeTab === "subscribed" ? "active" : ""}`}
                    onClick={() => setActiveTab("subscribed")}
                >
                    Subscribed
                </div>
            </div>

            <Outlet />

        </main>
    )
}

export default ChannelLayout