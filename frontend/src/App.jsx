import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Feed from './pages/Feed'
import Channel from './pages/Channel'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all pages with persistent Navbar and Sidebar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />{/*index = root */}
          <Route path="channel" element={<Channel />} />
        </Route>
        <Route path="channel" element={<Channel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App