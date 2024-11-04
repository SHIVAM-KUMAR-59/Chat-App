import { Router } from 'express'
import { verifyToken } from '../Middlewares.js/chat-middleware.js'
import MessageController from '../Controllers/message-controller.js'

const route = Router()

// Route to send messages
route.post('/api/messages', verifyToken, MessageController.sendMessage)

export default route
