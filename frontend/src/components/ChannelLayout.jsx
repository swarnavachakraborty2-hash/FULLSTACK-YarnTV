import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import api, { apiCall } from "../api/axios"
import { formatViews } from "../utils/formatters"
import { CameraIcon } from '../components/Icons'

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
    const [updatingAvatar, setUpdatingAvatar] = useState(false)
    const [updatingCover, setUpdatingCover] = useState(false)

    const avatarInputRef = useRef(null)
    const coverInputRef = useRef(null)

    // derive active tab from the URL — no side-effect navigation, no redirect bug
    const activeTab = location.pathname.endsWith('/playlists')
        ? 'playlist'
        : location.pathname.endsWith('/tweets')
            ? 'tweets' : location.pathname.endsWith('/subscribed-to')
                ? 'subscribed-to'
                : 'videos'

    const basePath = name ? `/profile/${name}` : '/channel'

    // Step 1: resolve which username we're actually looking at
    useEffect(() => {
        if (name) {
            setUsername(name)
        } else {
            apiCall(() => api.get("user/curr-user")
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
                }))
        }
    }, [name])

    // Step 2: fetch profile stats (subscribers, videos count, etc.) for whichever username we resolved
    useEffect(() => {
        if (!username) return

        apiCall(() => api.get(`user/profile/${username}`)
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
            }))
    }, [username])

    const onToggleSubscribe = () => {
        // confirm this matches your actual mounted subscription-toggle route
        apiCall(() => api.get(`subscription/${username}`)
            .then((res) => {
                if (res.data?.data) {
                    const nowSubscribed = res.data.data.isSubscribed
                    setIsSubscribed(nowSubscribed)
                    setSubscribers((prev) => nowSubscribed ? prev + 1 : Math.max(prev - 1, 0))
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            }))
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append("avatar", file)
        setUpdatingAvatar(true)
        apiCall(() => api.patch("user/edit-avatar", formData)
            .then((res) => {
                if (res.data?.data?.avatar) {
                    setAavatar(res.data.data.avatar)
                }
                setUpdatingAvatar(false)
            })
            .catch((err) => {
                console.log(err.response?.data)
                setUpdatingAvatar(false)
            }))
    }

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append("coverImage", file)
        setUpdatingCover(true)
        apiCall(() => api.patch("user/edit-coverImage", formData)
            .then((res) => {
                if (res.data?.data?.coverImage) {
                    setCoverImage(res.data.data.coverImage)
                }
                setUpdatingCover(false)
            })
            .catch((err) => {
                console.log(err.response?.data)
                setUpdatingCover(false)
            }))
    }

    return (
        <main className="channel-content">
            {/* Banner Image */}
            <div className="channel-banner" style={{ position: 'relative' }}>
                {coverImage ? (
                    <img src={coverImage} alt="Channel banner" />
                ) : (
                    <div className="channel-banner-placeholder" />
                )}
                {!name && (
                    <>
                        <input
                            type="file"
                            ref={coverInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleCoverChange}
                        />
                        <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            title="Edit cover image"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(18, 18, 18, 0.75)',
                                backdropFilter: 'blur(6px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                zIndex: 3
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.75)'}
                        >
                            <CameraIcon style={{ width: '14px', height: '14px' }} />
                            <span>{updatingCover ? "Uploading..." : "Edit Cover"}</span>
                        </button>
                    </>
                )}
            </div>

            {/* Channel Header / Profile info */}
            <section className="channel-header">
                <div className="channel-avatar-large" style={{ position: 'relative' }}>
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={username}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span>{username?.charAt(0).toUpperCase()}</span>
                    )}
                    {!name && (
                        <>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                title="Edit avatar"
                                style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    backgroundColor: 'var(--accent-purple)',
                                    border: '3px solid var(--bg-main)',
                                    color: '#09090b',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                    transition: 'transform 0.15s ease',
                                    zIndex: 4
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <CameraIcon style={{ width: '13px', height: '13px' }} />
                            </button>
                        </>
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
                                <button 
                                    type="button" 
                                    className="btn-channel-edit"
                                    onClick={() => navigate("/customize-channel")}
                                >
                                    Customize channel
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
                {!name && <div
                    className={`channel-tab ${activeTab === "subscribed-to" ? "active" : ""}`}
                    onClick={() => navigate(`${basePath}/subscribed-to`)}
                >
                    Subscribed
                </div>}

            </div>

            <Outlet />
        </main>
    )
}

export default ChannelLayout