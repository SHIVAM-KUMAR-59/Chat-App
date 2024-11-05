// src/components/ChatRoom.js
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000') // Connect to the backend server

const ChatRoom = ({ roomId, username }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Join the specified room when the component mounts
    socket.emit('join_room', roomId)

    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // Clean up the event listener on component unmount
    return () => {
      socket.off('receive_message')
    }
  }, [roomId])

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Emit a message to the server
      const messageData = {
        roomId,
        sender: username,
        message,
      }

      socket.emit('send_message', messageData)
      setMessages((prevMessages) => [...prevMessages, messageData]) // Add message to local state
      setMessage('') // Clear input
    }
  }

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatRoom
