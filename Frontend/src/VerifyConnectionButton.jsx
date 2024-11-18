import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000')

const VerifyConnectionButton = () => {
  useEffect(() => {
    // Listen for confirmation from the server
    socket.on('connection_verified', (data) => {
      console.log('Connection status:', data.status) // Should log "connected"
      alert('Connected to Socket.IO server')
    })
  }, [])

  const handleVerifyConnection = () => {
    socket.emit('verify_connection')
  }

  return (
    <button onClick={handleVerifyConnection}>Verify Socket Connection</button>
  )
}

export default VerifyConnectionButton
