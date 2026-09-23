import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from "../api/axios"

function ChannelPlaylists() {
    const navigate = useNavigate()
    const { name } = useParams()
    const [userId, setUserId] = useState("")

    const [playlists, setPlaylists] = useState([])

    useEffect(() => {
        if (name) {
            // profile route only gives us a username, not an id —
            // resolve it via the profile endpoint (adjust if get-user-playlists
            // accepts a username instead of an id on your backend)
            api.get(`user/profile/${name}`)
                .then((res) => {
                    if (res.data) {
                        setUserId(res.data.data._id)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        } else {
            api.get("user/curr-user")
                .then((res) => {
                    if (res.data) {
                        setUserId(res.data.data._id)
                    }
                })
                .catch((err) => {
                    console.log(err.response?.data)
                })
        }
    }, [name])

    useEffect(() => {
        if (!userId) return

        api.get(`playlist/get-user-playlists/${userId}`)
            .then((res) => {
                if (res.data) {
                    setPlaylists(res.data.data)
                }
            })
            .catch((err) => {
                console.log(err.response?.data)
            })
    }, [userId])

    return (
        <section className="channel-section">
            <div className="section-title-row">
                <h2 className="section-heading">{name ? `Playlists` : `My playlists`}</h2>
                <button type="button" className="btn-see-all">See all</button>
            </div>

            {playlists.length > 0 ? (
                <div className="channel-videos-row">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className="playlist-card"
                            onClick={() => navigate(`/playlist/${playlist._id}`)}
                        >
                            <div className="playlist-thumb">
                                <img
                                    src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
                                    alt={playlist.name}
                                />
                                <span className="playlist-video-count">
                                    🎞 {playlist.videos} videos
                                </span>
                            </div>
                            <div className="playlist-info">
                                <h3 className="playlist-title">{playlist.name}</h3>
                                <p className="playlist-meta">Playlist · View full playlist</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="video-meta">No playlists yet.</p>
            )}
        </section>
    )
}

export default ChannelPlaylists