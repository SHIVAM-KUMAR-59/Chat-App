import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/configDB.js'
import User from './Schemas/UserSchema.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

// Connect with the Database
connectDB(MONGODB_URI)

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})