// controllers/socketController.js
export const handleSocketConnection = (socket) => {
  console.log(`User connected: ${socket.id}`)
  socket.on('verify_connection', () => {
    console.log(`Verified connection with user: ${socket.id}`)
    socket.emit('connection_verified', { status: 'connected' })
  })
  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
