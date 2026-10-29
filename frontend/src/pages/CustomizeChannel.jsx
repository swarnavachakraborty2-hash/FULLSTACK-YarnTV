import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { apiCall } from '../api/axios'

function CustomizeChannel() {
  const navigate = useNavigate()

  // 1. User details state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [coverImage, setCoverImage] = useState('')

  // 2. Password state
  const [showPasswordInputs, setShowPasswordInputs] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // 3. Feedback messages
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load current user details as default values on page load
  useEffect(() => {
    apiCall(() => api.get("/user/curr-user")
      .then((res) => {
        const user = res.data?.data || {}
        setUsername(user.username || '')
        setEmail(user.email || '')
        setAvatar(user.avatar || '')
        setCoverImage(user.coverImage || '')
      })
      .catch((err) => console.log(err.response?.data)))
  }, [])

  // ONE button updates both username and email
  const onEditAccountDetails = (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    apiCall(() => api.patch("user/edit-account", { username, email })
      .then((res) => {
        setUsername(res.data.data.username)
        setEmail(res.data.data.email)
        setMessage("Account details updated successfully!")
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to update account details.")
      }))
  }

  // Update password
  const onEditPassword = (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    apiCall(() => api.patch("user/change-password", { oldPassword, newPassword })
      .then(() => {
        setOldPassword(newPassword)
        setNewPassword('')
        setShowPasswordInputs(false)
        setMessage("Password changed successfully!")
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to change password.")
      }))
  }

  // Update Avatar
  const onUpdateAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("avatar", file)

    apiCall(() => api.patch("user/edit-avatar", formData)
      .then((res) => {
        setAvatar(res.data.data.avatar)
        setMessage("Avatar updated!")
      })
      .catch((err) => console.log(err.response?.data)))
  }

  // Update Cover Image
  const onUpdateCoverImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("coverImage", file)

    apiCall(() => api.patch("user/edit-coverImage", formData)
      .then((res) => {
        setCoverImage(res.data.data.coverImage)
        setMessage("Cover image updated!")
      })
      .catch((err) => console.log(err.response?.data)))
  }

  // Delete account
  const onDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      apiCall(() => api.delete("user/deleteAccount")
        .then(() => navigate("/register"))
        .catch((err) => console.log(err.response?.data)))
    }
  }

  return (
    <main className="feed-content">
      <div className="customize-container">

        {/* Header with back button */}
        <div className="customize-header">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="customize-back-btn"
          >
            ← Back
          </button>
          <h1 className="customize-title">Customize Channel</h1>
        </div>

        {/* Feedback Messages */}
        {message && <div className="customize-alert-success">✓ {message}</div>}
        {error && <div className="customize-alert-error">✕ {error}</div>}

        {/* 1. Branding Section (Cover Image and Avatar) */}
        <div className="customize-card">
          <h2 className="customize-card-title">Channel Branding</h2>
          
          {/* Cover Image */}
          <div className="customize-field">
            <label className="customize-label">Banner Image</label>
            {coverImage && (
              <img src={coverImage} alt="Banner" className="customize-banner-preview" />
            )}
            <input type="file" accept="image/*" onChange={onUpdateCoverImage} className="customize-file-input" />
          </div>

          {/* Avatar */}
          <div className="customize-field">
            <label className="customize-label">Profile Avatar</label>
            <div className="customize-avatar-row">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="customize-avatar-img" />
              ) : (
                <div className="customize-avatar-placeholder">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <input type="file" accept="image/*" onChange={onUpdateAvatar} className="customize-file-input" />
            </div>
          </div>
        </div>

        {/* 2. Account Details Section (Username and Email with ONE Update Button) */}
        <form onSubmit={onEditAccountDetails} className="customize-card">
          <h2 className="customize-card-title">Account Details</h2>

          <div className="customize-field">
            <label className="customize-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="customize-input"
            />
          </div>

          <div className="customize-field">
            <label className="customize-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="customize-input"
            />
          </div>

          {/* ONE submit button for both username and email */}
          <button type="submit" className="customize-btn-primary">
            Update Account Details
          </button>
        </form>

        {/* 3. Password Section */}
        <div className="customize-card">
          <h2 className="customize-card-title">Password</h2>

          {!showPasswordInputs ? (
            <div className="customize-password-row">
              <span className="customize-password-dots">••••••••••••</span>
              <button
                type="button"
                onClick={() => setShowPasswordInputs(true)}
                className="customize-btn-primary"
              >
                Edit Password
              </button>
            </div>
          ) : (
            <form onSubmit={onEditPassword}>
              <div className="customize-field">
                <label className="customize-label">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  required
                  className="customize-input"
                />
              </div>

              <div className="customize-field">
                <label className="customize-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="customize-input"
                />
              </div>

              <div className="customize-actions-row">
                <button type="submit" className="customize-btn-primary">
                  Submit Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordInputs(false)
                    setOldPassword('')
                    setNewPassword('')
                  }}
                  className="customize-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 4. Delete Account Section */}
        <div className="customize-card customize-danger-card">
          <h2 className="customize-danger-title">Delete Account</h2>
          <p className="customize-danger-text">
            Permanently delete your account and all your content.
          </p>
          <button
            type="button"
            onClick={onDeleteAccount}
            className="customize-btn-danger"
          >
            Delete Account
          </button>
        </div>

      </div>
    </main>
  )
}

export default CustomizeChannel