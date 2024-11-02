import { Router } from 'express'
import { verifyToken } from '../Middlewares.js/chat-middleware.js'
import ChatController from '../Controllers/chat-controller.js'

const route = Router()

route.post('/api/chat/private', verifyToken, ChatController.createPrivateChat)
export default route
