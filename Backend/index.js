// server/index.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/configDB.js'
import userRoutes from './Routes/user-routes.js'
import chatRoutes from './Routes/chat-routes.js'
import messageRoutes from './Routes/message-routes.js'
import { handleSocketConnection } from './Controllers/socket-controller.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

// Enabling CORS and parsing JSON
app.use(cors())
app.use(express.json())

// Connect to the Database
connectDB(MONGODB_URI)

// Use routes
app.use(userRoutes)
app.use(chatRoutes)
app.use(messageRoutes)

// Root route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// Create an HTTP server and attach Socket.IO to it
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

// Socket.IO connection setup
io.on('connection', handleSocketConnection)

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
