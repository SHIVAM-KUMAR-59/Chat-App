import { Router } from 'express'
import { verifyToken } from '../Middlewares.js/chat-middleware.js'
import ChatController from '../Controllers/chat-controller.js'

const route = Router()

// Route to create a private chat
route.post('/api/chat/private', verifyToken, ChatController.createPrivateChat)

// Route to create a group chat
route.post('/api/chat/group', verifyToken, ChatController.createGroupChat)
export default route
