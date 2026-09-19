import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from "./pages/Login"
import Channel from './pages/Channel'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="channel" element={<Channel />} />
          {/* Add new pages here as nested routes: */}
          {/* <Route path="tweets" element={<Tweets />} /> */}
          {/* <Route path="liked" element={<LikedVideos />} /> */}
          {/* <Route path="history" element={<History />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App