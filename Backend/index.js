import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/configDB.js'
import userRoutes from './Routes/user-routes.js'
import chatRoutes from './Routes/chat-routes.js'

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

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
