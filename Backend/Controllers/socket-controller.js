// controllers/socketController.js
export const handleSocketConnection = (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Join a specific room
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  // Listen for messages sent by clients
  socket.on('send_message', (data) => {
    const { roomId, message, sender } = data
    console.log(`Message received from ${sender} in room ${roomId}: ${message}`)

    // Broadcast the message to all clients in the room, including the sender
    socket.to(roomId).emit('receive_message', {
      sender,
      message,
      roomId,
      timestamp: new Date().toISOString(),
    })
  })

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
