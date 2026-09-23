import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import api from "../api/axios"
import { formatViews } from "../utils/formatters"

function ChannelLayout() {

    const { name } = useParams() // undefined on "/channel", set on "/profile/:name"
    const navigate = useNavigate()
    const location = useLocation()

    const [avatar, setAavatar] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [subscribers, setSubscribers] = useState(0)
    const [subscribedTo, setSubscribedTo] = useState(0)
    const [totalVideos, setTotalVideos] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false)

    // derive active tab from the URL — no side-effect navigation, no redirect bug
    const activeTab = location.pathname.endsWith('/playlists')
        ? 'playlist'
        : location.pathname.endsWith('/tweets')
            ? 'tweets'
            : 'videos'

    const basePath = name ? `/profile/${name}` : '/channel'

    // Step 1: resolve which username we're actually looking at
    useEffect(() => {
        if (name) {
            setUsername(name)
        } else {
            api.get("user/curr-user")
                .then((res) => {
                    if (res.data) {
                        setUsername(res.data.data.username)
                        setAavatar(res.data.data.avatar)
                        setCoverImage(res.data.data.coverImage)
                        setFullname(res.data.data.fullname)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        }
    }, [name])

    // Step 2: fetch profile stats (subscribers, videos count, etc.) for whichever username we resolved
    useEffect(() => {
        if (!username) return

        api.get(`user/profile/${username}`)
            .then((res) => {
                if (res.data) {
                    setSubscribers(res.data.data.subscribersCount)
                    setSubscribedTo(res.data.data.subcsribedToCount)
                    setTotalVideos(res.data.data.videos)
                    setIsSubscribed(res.data.data.isSubscribed)
                    // if viewing someone else, this endpoint is also our only source
                    // for avatar/coverImage/fullname (since Step 1 skipped curr-user)
                    if (name) {
                        setAavatar(res.data.data.avatar)
                        setCoverImage(res.data.data.coverImage)
                        setFullname(res.data.data.fullname)
                    }
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [username])

    const onToggleSubscribe = () => {
        // confirm this matches your actual mounted subscription-toggle route
        api.get(`subscription/${username}`)
            .then((res) => {
                if (res.data?.data) {
                    const nowSubscribed = res.data.data.isSubscribed
                    setIsSubscribed(nowSubscribed)
                    setSubscribers((prev) => nowSubscribed ? prev + 1 : Math.max(prev - 1, 0))
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }

    return (
        <main className="channel-content">
            {/* Banner Image */}
            <div className="channel-banner">
                {coverImage ? (
                    <img src={coverImage} alt="Channel banner" />
                ) : (
                    <div className="channel-banner-placeholder" />
                )}
            </div>

            {/* Channel Header / Profile info */}
            <section className="channel-header">
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
                    <p className="channel-handle">@{username}</p>
                    <p className="channel-stats">
                        {formatViews(subscribers)} Subscribers · {formatViews(subscribedTo)} Subscribed · {totalVideos} Videos
                    </p>
                    <div className="channel-actions-row">
                        {name ? (
                            <button
                                type="button"
                                className={isSubscribed ? "btn-channel-edit" : "btn-signup"}
                                onClick={onToggleSubscribe}
                            >
                                {isSubscribed ? "Subscribed" : "Subscribe"}
                            </button>
                        ) : (
                            <>
                                <button type="button" className="btn-channel-edit">
                                    Customize channel
                                </button>
                                <button type="button" className="btn-channel-manage">
                                    Manage videos
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Channel Tabs */}
            <div className="channel-tabs">
                <div
                    className={`channel-tab ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => navigate(basePath)}
                >
                    Videos
                </div>
                <div
                    className={`channel-tab ${activeTab === "playlist" ? "active" : ""}`}
                    onClick={() => navigate(`${basePath}/playlists`)}
                >
                    Playlists
                </div>
                <div
                    className={`channel-tab ${activeTab === "tweets" ? "active" : ""}`}
                    onClick={() => navigate(`${basePath}/tweets`)}
                >
                    Tweets
                </div>
            </div>

            <Outlet />
        </main>
    )
}

export default ChannelLayout