// index.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http' // Import http to create an HTTP server
import { Server } from 'socket.io' // Import Socket.IO
import { connectDB } from './config/configDB.js'
import userRoutes from './Routes/user-routes.js'
import chatRoutes from './Routes/chat-routes.js'
import messageRoutes from './Routes/message-routes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

// Enabling CORS
app.use(cors())

// Middleware to parse JSON request bodies
app.use(express.json())

// Connect with the Database
connectDB(MONGODB_URI)

// Using the routes
app.use(userRoutes)
app.use(chatRoutes)
app.use(messageRoutes)

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Create an HTTP server and attach Socket.IO to it
const server = createServer(app) // Create HTTP server from the Express app
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this for security in production
  },
})

// Set up Socket.IO events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Simple event to verify connection
  socket.on('verify_connection', () => {
    console.log(`Verified connection with user: ${socket.id}`)
    socket.emit('connection_verified', { status: 'connected' })
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
