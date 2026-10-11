import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function CustomizeChannel() {
  const [currUser, setCurrUser] = useState({})// set the old values as default placeholders except password
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")//value of old password input
  const [newPassword, setNewPassword] = useState("")//same for new password input
  const [isActive, setIsActive] = useState(false)
  const [showOldPasswordInput, setShowOldPasswordInput] = useState(false)
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false)
  const [username, setUsername] = useState("")
  const [coverImage, setCoverimage] = useState("")
  const [avatar, setAavatar] = useState("")

  const navigate = useNavigate()

  //loads all the placeholders
  useEffect(() => { //automatically load the current user details like username, on the username input placeholder from currUser object
    api.get("/user/curr-user")
      .then((res) => {
        setCurrUser(res.data.data)
        setUsername(res.data.data.username)
        setEmail(res.data.data.email)
        setCoverimage(res.data.data.coverImage)
        setAavatar(res.data.data.avatar)
      })
      .catch((err) => console.log(err.response?.data))
  }, [])



  const onEditPassword = (e) => { //display an edit password button on clicking which will show two inputs one for old and one for new passwords
    e.preventDefault()
    setShowOldPasswordInput(true)
    setShowNewPasswordInput(true)
    api.patch("user/change-password", { oldPassword, newPassword })
      .then(() => {
        setOldPassword(newPassword)
        setNewPassword("")
        setShowNewPasswordInput(false)
      })
      .catch((err) => console.log(err.response?.data))
  }


  const onDeleteAccount = () => {
    api.delete("user/deleteAccount")
      .then(() => navigate("/register"))
      .catch((err) => console.log(err.response?.data))
  }


  const onEditAccountDetails = (e) => {// one update button for both email and username fields 
    e.preventDefault()
    api.patch("user/edit-account", { username, email })
      .then((res) => {
        setUsername(res.data.data.username)
        setEmail(res.data.data.email)
      })
      .catch((err) => console.log(err.response?.data))
  }


  const onUpdateAvatar = () => {
    api.patch("user/edit-avatar")
      .then((res) => {
        setAavatar(res.data.data.avatar)
      })
      .catch((err) => console.log(err.response?.data))
  }

  const onUpdateCoverImage = () => {
    api.patch("user/edit-coverImage")
      .then((res) => {
        setCoverimage(res.data.data.coverImage)
      })
      .catch((err) => console.log(err.response?.data))
  }


  return (
    <div>CustomizeChannel</div>
  )
}

export default CustomizeChannel