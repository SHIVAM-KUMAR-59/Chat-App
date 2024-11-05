// src/App.js
import React, { useState } from 'react'
import ChatRoom from './ChatRoom.jsx'

function App() {
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)

  const joinRoom = () => {
    if (username.trim() && roomId.trim()) {
      setIsInRoom(true)
    }
  }

  return (
    <div className="App">
      <h1>Socket.IO Chat</h1>
      {!isInRoom ? (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <ChatRoom roomId={roomId} username={username} />
      )}
    </div>
  )
}

export default App
