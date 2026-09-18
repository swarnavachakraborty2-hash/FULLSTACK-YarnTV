import React, { useState } from 'react'
import api from "../api/axios"
import { useNavigate } from 'react-router-dom'

function Login() {
    const [identifier, setIdentifier] = useState("") // holds username OR email
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        api.post("/user/login", { username: identifier, email: identifier, password: password })
            .then((res) => {
                console.log(res.data.message)
                navigate("/")
            })
            .catch((err) => {
                console.log(err.response.data.message)
            })
    }


    return (
        <div className="auth-page">

            {/* Left branding panel — reused from signup */}
            <div className="auth-brand-panel">
                <div className="auth-brand-content">
                    <div className="auth-brand-logo">
                        {/* replace with your actual logo component/img */}
                    </div>

                    <h1 className="auth-brand-title">PLAY</h1>

                    <p className="auth-brand-tagline">
                        Your next-gen video &amp; social platform.<br />
                        Create. Share. Connect.
                    </p>

                    <div className="auth-brand-features">
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Upload and stream HD videos
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Post tweets &amp; engage your audience
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Build playlists &amp; grow your channel
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">

                    <div style={{ marginBottom: '28px' }}>
                        <h2 className="auth-form-title">Welcome back</h2>
                        <p className="auth-form-subtitle">
                            Don't have an account?{" "}
                            <span className="auth-link-btn" onClick={()=>navigate("/register")}>Sign up</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">

                        <div className="form-group">
                            <label htmlFor="identifier" className="form-label">
                                Username or Email <span className="required-star">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="identifier"
                                    type="text"
                                    placeholder="@your_username or you@example.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password <span className="required-star">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input input-with-suffix"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="input-suffix-btn"
                                >
                                    {showPassword ? "hide" : "👁"}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span className="auth-link-btn" style={{ fontSize: '13px' }}>
                                Forgot password?
                            </span>
                        </div>

                        <button type="submit" className="btn-register">
                            Log In
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login