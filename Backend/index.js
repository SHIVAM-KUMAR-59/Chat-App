// server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http' // Import the HTTP module
import { connectDB } from './config/configDB.js'
import userRoutes from './Routes/user-routes.js'
import chatRoutes from './Routes/chat-routes.js'
import { io as ClientSocket } from 'socket.io-client' // Import the Socket.IO client

dotenv.config()
const app = express()
const server = http.createServer(app) // Create an HTTP server
const io = new Server(server, { cors: { origin: '*' } }) // Pass the server instance to Socket.IO
const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

// Enabling CORS
app.use(cors())

// Middleware to parse JSON request bodies
app.use(express.json())

// Connect with the Database
connectDB(MONGODB_URI)

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('Client connected')

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

// Simulating a client connection
const simulateClientConnection = () => {
  const clientSocket = ClientSocket('http://localhost:' + PORT) // Use the client socket to connect

  clientSocket.on('connect', () => {
    console.log('Simulated client connected')
  })

  clientSocket.on('disconnect', () => {
    console.log('Simulated client disconnected')
  })
}

simulateClientConnection() // Call the function to simulate client connection

// Using the routes
app.use(userRoutes)
app.use(chatRoutes)

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
