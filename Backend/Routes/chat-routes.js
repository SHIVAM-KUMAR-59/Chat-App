import { Router } from 'express'
import { verifyToken } from '../Middlewares/chat-middleware.js'
import ChatController from '../Controllers/chat-controller.js'

const route = Router()

// Apply verifyToken middleware to all routes in this router
route.use(verifyToken)

// Route to create a private chat
route.post('/api/chat/private', ChatController.createPrivateChat)

// Route to create a group chat
route.post('/api/chat/group', ChatController.createGroupChat)

// Route to add or remove participants in a group chat by chatId
route.patch(
  '/api/chat/group/:chatId/participants',
  ChatController.updateChatParticipants,
)

export default route
