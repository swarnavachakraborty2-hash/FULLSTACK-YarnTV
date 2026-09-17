import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayLogo, EyeIcon, EyeOffIcon, UploadIcon, ImageIcon } from '../components/Icons'
import api from "../api/axios"

function Register() {
  // =========================================================================
  // States and API handler go here — leave empty for your implementation
  // Required fields:  username, fullname, email, password, avatar (file)
  // Optional fields:  coverImage (file)
  // =========================================================================
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")



  const navigate = useNavigate()

  // ── Preview helpers (no API logic – purely UI) ──
  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))

  }

  function handleCoverChange(e) {
    const file = e.target.files[0]
    if (file) setCoverPreview(URL.createObjectURL(file))

  }

  const onSubmit = (e) => {

    e.preventDefault()
    const formData = new FormData(e.target)

    api.post("/user/register", formData)
      .then((res) => {
        console.log(res.data.message)
        navigate("/login")
      }).catch((err) => {
        console.log("STATUS:", err.response?.status)
        console.log("MESSAGE:", err.response?.data?.message)
      })

  }


  return (
    <div className="auth-page">
      {/* Left Panel – Branding */}
      <aside className="auth-brand-panel">
        <div className="auth-brand-content">
          <PlayLogo className="auth-brand-logo" />
          <h1 className="auth-brand-title">PLAY</h1>
          <p className="auth-brand-tagline">
            Your next-gen video &amp; social platform.
            <br />
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
      </aside>


      {/* Right Panel – Registration Form */}
      <form onSubmit={onSubmit}>
        <main className="auth-form-panel">
          <div className="auth-form-container">

            {/* Cover Image Upload */}
            <label className="cover-upload-area" htmlFor="coverImage">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="cover-preview-img" />
              ) : (
                <div className="cover-upload-placeholder">
                  <ImageIcon className="cover-upload-icon" />
                  <span>Upload Banner Image</span>
                  <span className="upload-optional-tag">Optional</span>
                </div>
              )}
              <input
                id="coverImage"
                name="coverImage"
                type="file"

                accept="image/*"
                className="file-input-hidden"
                onChange={handleCoverChange}
              />
            </label>

            {/* Avatar Upload + Form Header */}
            <div className="auth-form-header">
              <label className="avatar-upload-circle" htmlFor="avatar" title="Upload avatar">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-upload-placeholder">
                    <UploadIcon className="avatar-upload-icon" />
                  </div>
                )}
                <span className="avatar-upload-badge">+</span>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"

                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              <div>
                <h2 className="auth-form-title">Create your account</h2>
                <p className="auth-form-subtitle">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <div className="register-form">

              {/* Row: Username + Full Name */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix">@</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      placeholder="your_username"
                      className="form-input input-with-prefix"
                      autoComplete="username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="fullname" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="John Doe"
                    className="form-input"
                    autoComplete="name"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  value={email}
                  type="email"
                  placeholder="you@example.com"
                  className="form-input"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8–20 characters"
                    className="form-input input-with-suffix"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-suffix-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOffIcon className="input-suffix-icon" />
                      : <EyeIcon className="input-suffix-icon" />
                    }
                  </button>
                </div>
                <p className="form-hint">Must be between 8 and 20 characters.</p>
              </div>

              {/* Avatar required notice */}
              <p className="avatar-required-note">
                <span className="required-star">*</span> Avatar image is required. Click the photo
                above to upload one.
              </p>

              {/* Submit */}
              <button type="submit" className="btn-register">
                Create Account
              </button>
            </div>
          </div>
        </main>
      </form>
    </div>
  )
}

export default Register