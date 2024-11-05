// controllers/socketController.js
import Message from '../Schemas/MessageSchema.js' // Import the Message model to save messages to the database

export const handleSocketConnection = (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Verify connection
  socket.on('verify_connection', () => {
    console.log(`Verified connection with user: ${socket.id}`)
    socket.emit('connection_verified', { status: 'connected' })
  })

  // Join a specific chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId)
    console.log(`User ${socket.id} joined chat: ${chatId}`)
  })

  // Handle sending a message
  socket.on(
    'send-message',
    async ({ chatId, senderId, content, media, replyTo }) => {
      try {
        // Save the message to the database
        const newMessage = new Message({
          chatId,
          sender: senderId,
          content,
          media,
          replyTo,
        })
        await newMessage.save()

        // Emit the message to all clients in the chat room
        socket.to(chatId).emit('receive-message', newMessage)
        socket.emit('receive-message', newMessage) // Emit to the sender as well
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Message could not be sent.' })
      }
    },
  )

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
