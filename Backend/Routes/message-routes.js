import { Router } from 'express'
import { verifyToken } from '../Middlewares.js/chat-middleware.js'
import MessageController from '../Controllers/message-controller.js'

const route = Router()

// Apply verifyToken middleware to all routes in this router
route.use(verifyToken)

// Route to send messages
route.post('/api/messages', MessageController.sendMessage)

// Route to get all messages of a chat by chatId
route.get('/api/messages/:chatId', MessageController.getMessages)

// Route to delete a message
route.delete('/api/messages/:messageId', MessageController.deleteMessage)

export default route
