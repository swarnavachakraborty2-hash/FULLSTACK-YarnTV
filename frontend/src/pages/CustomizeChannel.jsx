import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function CustomizeChannel() {
  const [currUser, setCurrUser] = useState({})
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")//set as the default old user password
  const [newPassword, setNewPassword] = useState("")
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false)
  const [username, setUsername] = useState("")
  const [coverImage, setCoverimage] = useState("")
  const [avatar, setAavatar] = useState("")

  const navigate = useNavigate()


  useEffect(() => { //automatically load the current user details like username, on the username input placeholder from currUser object
    api.get("/user/curr-user")
      .then((res) => {
        setCurrUser(res.data.data)
      })
      .catch((err) => console.log(err.response?.data))
  }, [])



  const onChangePassword = (e) => {
    setShowNewPasswordInput(true)
    api.post("user/change-password", { oldPassword, newPassword })
      .then(() => {
        setOldPassword(newPassword)
        setNewPassword("")
        setShowNewPasswordInput(false)
      })
      .catch((err) => console.log(err.response?.data))

  }

  
  const onDelete = () => {
    api.delete("user/deleteAccount")
      .then(() => navigate("/register"))
      .catch((err) => console.log(err.response?.data))
  }



  return (
    <div>CustomizeChannel</div>
  )
}

export default CustomizeChannel