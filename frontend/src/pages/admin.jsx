import React from 'react'

function Admin() {
  return (
    <main className="feed-content" style={{ padding: '28px 36px', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Statistics</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Welcome to your creator dashboard.</p>
      </div>
    </main>
  )
}

export default Admin
