import React, { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { CameraIcon } from '../components/Icons'

function CustomizeChannel() {
  const navigate = useNavigate()

  // User details state
  const [currUser, setCurrUser] = useState({})
  const [username, setUsername] = useState('')
  const [defaultUsername, setDefaultUsername] = useState('')
  const [email, setEmail] = useState('')
  const [defaultEmail, setDefaultEmail] = useState('')
  const [fullname, setFullname] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [avatar, setAvatar] = useState('')

  // Password state
  const [showPasswordInputs, setShowPasswordInputs] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Account details state (username & email)
  const [updatingUsername, setUpdatingUsername] = useState(false)
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const [accountError, setAccountError] = useState('')
  const [accountSuccess, setAccountSuccess] = useState('')

  // File upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  // Delete account confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  //there should be one submit button
  

  // Loading indicator for initial fetch
  const [initialLoading, setInitialLoading] = useState(true)

  // Load all default values from current user
  useEffect(() => {
    api.get("/user/curr-user")
      .then((res) => {
        if (res.data?.data) {
          const user = res.data.data
          setCurrUser(user)
          setUsername(user.username || '')
          setDefaultUsername(user.username || '')
          setEmail(user.email || '')
          setDefaultEmail(user.email || '')
          setFullname(user.fullname || '')
          setCoverImage(user.coverImage || '')
          setAvatar(user.avatar || '')
        }
        setInitialLoading(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setInitialLoading(false)
      })
  }, [])

  // Update Username
  const onUpdateUsername = (e) => {
    if (e) e.preventDefault()
    if (!username.trim()) {
      setAccountError("Username cannot be empty.")
      return
    }
    setAccountError('')
    setAccountSuccess('')
    setUpdatingUsername(true)

    api.patch("user/edit-account", { username: username.trim(), email: email.trim() })
      .then((res) => {
        const updated = res.data?.data
        if (updated?.username) {
          setUsername(updated.username)
          setDefaultUsername(updated.username)
        }
        setAccountSuccess("Username updated successfully!")
        setUpdatingUsername(false)
        setTimeout(() => setAccountSuccess(''), 4000)
      })
      .catch((err) => {
        setAccountError(err.response?.data?.message || "Failed to update username.")
        setUpdatingUsername(false)
      })
  }

  // Update Email
  const onUpdateEmail = (e) => {
    if (e) e.preventDefault()
    if (!email.trim()) {
      setAccountError("Email cannot be empty.")
      return
    }
    setAccountError('')
    setAccountSuccess('')
    setUpdatingEmail(true)

    api.patch("user/edit-account", { username: username.trim(), email: email.trim() })
      .then((res) => {
        const updated = res.data?.data
        if (updated?.email) {
          setEmail(updated.email)
          setDefaultEmail(updated.email)
        }
        setAccountSuccess("Email updated successfully!")
        setUpdatingEmail(false)
        setTimeout(() => setAccountSuccess(''), 4000)
      })
      .catch((err) => {
        setAccountError(err.response?.data?.message || "Failed to update email.")
        setUpdatingEmail(false)
      })
  }

  // Update Password
  const onEditPassword = (e) => {
    if (e) e.preventDefault()
    if (!oldPassword || !newPassword) {
      setPasswordError("Both old and new passwords are required.")
      return
    }
    setPasswordError('')
    setPasswordSuccess('')
    setPasswordLoading(true)

    api.patch("user/change-password", { oldPassword, newPassword })
      .then(() => {
        setOldPassword(newPassword)
        setNewPassword("")
        setShowPasswordInputs(false)
        setPasswordSuccess("Password updated successfully!")
        setPasswordLoading(false)
        setTimeout(() => setPasswordSuccess(''), 4000)
      })
      .catch((err) => {
        setPasswordError(err.response?.data?.message || "Failed to change password. Please check your old password.")
        setPasswordLoading(false)
      })
  }

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("avatar", file)
    setUploadingAvatar(true)

    api.patch("user/edit-avatar", formData)
      .then((res) => {
        if (res.data?.data?.avatar) {
          setAvatar(res.data.data.avatar)
        }
        setUploadingAvatar(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setUploadingAvatar(false)
      })
  }

  // Cover Image upload
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("coverImage", file)
    setUploadingCover(true)

    api.patch("user/edit-coverImage", formData)
      .then((res) => {
        if (res.data?.data?.coverImage) {
          setCoverImage(res.data.data.coverImage)
        }
        setUploadingCover(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setUploadingCover(false)
      })
  }

  // Delete Account
  const onDeleteAccount = () => {
    setDeletingAccount(true)
    api.delete("user/deleteAccount")
      .then(() => {
        navigate("/register")
      })
      .catch((err) => {
        console.log(err.response?.data)
        setDeletingAccount(false)
        setShowDeleteModal(false)
      })
  }

  if (initialLoading) {
    return (
      <main className="feed-content" style={{ padding: '32px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading channel settings...</p>
      </main>
    )
  }

  return (
    <main className="feed-content" style={{ padding: '32px 24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent-purple)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Channel Customization</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Manage your channel branding, basic info, and account credentials</p>
          </div>
        </div>

        {/* Section 1: Branding (Banner & Avatar) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Channel Branding</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Your banner and profile picture appear across your channel and videos</p>
          </div>

          {/* Banner Preview & Upload */}
          <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
            {coverImage ? (
              <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#1a102b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No banner image set
              </div>
            )}
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
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.95)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.8)'}
            >
              <CameraIcon style={{ width: '14px', height: '14px' }} />
              <span>{uploadingCover ? "Uploading..." : "Change Banner"}</span>
            </button>
          </div>

          {/* Avatar Preview & Upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0 }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt={username}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '28px'
                }}>
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
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
                title="Change Avatar"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: 'var(--accent-purple)',
                  border: '2px solid var(--bg-card)',
                  color: '#09090b',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <CameraIcon style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{fullname || username}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>@{username}</div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  marginTop: '8px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {uploadingAvatar ? "Uploading avatar..." : "Upload New Picture"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Account Details (Username & Email) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Account Details</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Update your username and email address</p>
          </div>

          {accountSuccess && (
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ✓ {accountSuccess}
            </div>
          )}

          {accountError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ✕ {accountError}
            </div>
          )}

          {/* Username Input Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Username
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button
                type="button"
                onClick={onUpdateUsername}
                disabled={updatingUsername || username === defaultUsername || !username.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: username !== defaultUsername && username.trim() ? 'var(--accent-purple)' : 'var(--bg-surface)',
                  color: username !== defaultUsername && username.trim() ? '#09090b' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: username !== defaultUsername && username.trim() && !updatingUsername ? 'pointer' : 'default',
                  opacity: username !== defaultUsername && username.trim() ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  border: username === defaultUsername ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {updatingUsername ? "Updating..." : "Update"}
              </button>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Current: @{defaultUsername}
            </span>
          </div>

          {/* Email Input Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button
                type="button"
                onClick={onUpdateEmail}
                disabled={updatingEmail || email === defaultEmail || !email.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: email !== defaultEmail && email.trim() ? 'var(--accent-purple)' : 'var(--bg-surface)',
                  color: email !== defaultEmail && email.trim() ? '#09090b' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: email !== defaultEmail && email.trim() && !updatingEmail ? 'pointer' : 'default',
                  opacity: email !== defaultEmail && email.trim() ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  border: email === defaultEmail ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {updatingEmail ? "Updating..." : "Update"}
              </button>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Current: {defaultEmail}
            </span>
          </div>
        </div>

        {/* Section 3: Password / Security */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Password & Security</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Change your account password securely</p>
          </div>

          {passwordSuccess && (
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ✓ {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ✕ {passwordError}
            </div>
          )}

          {!showPasswordInputs ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Password</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '2px' }}>
                  ••••••••••••
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordInputs(true)
                  setPasswordError('')
                  setPasswordSuccess('')
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-purple)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(174, 122, 255, 0.12)'; e.currentTarget.style.borderColor = 'var(--accent-purple)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
              >
                Edit Password
              </button>
            </div>
          ) : (
            <form onSubmit={onEditPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={passwordLoading || !oldPassword || !newPassword}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--accent-purple)',
                    color: '#09090b',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: (passwordLoading || !oldPassword || !newPassword) ? 'not-allowed' : 'pointer',
                    opacity: (passwordLoading || !oldPassword || !newPassword) ? 0.6 : 1,
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {passwordLoading ? "Updating..." : "Submit Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordInputs(false)
                    setOldPassword('')
                    setNewPassword('')
                    setPasswordError('')
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 4: Danger Zone (Delete Account) */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.04)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#f87171' }}>Danger Zone</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Once you delete your account, there is no going back. All your videos, playlists, tweets, and profile data will be permanently removed.
          </p>

          <div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f87171', margin: 0 }}>Delete Account?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDeleteAccount}
                disabled={deletingAccount}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: deletingAccount ? 'not-allowed' : 'pointer'
                }}
              >
                {deletingAccount ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default CustomizeChannel