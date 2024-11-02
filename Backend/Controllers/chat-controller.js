import ChatSchema from '../Schemas/ChatSchema.js'
import UserSchema from '../Schemas/UserSchema.js'

class ChatController {
  static createPrivateChat = async (req, res) => {
    try {
      const { userId } = req.body
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      const otherUserId = userId
      const currentUserId = req.user.id
      console.log('Other User: ', otherUserId)
      console.log('Current User: ', currentUserId)

      // Fetch details of the other user
      const otherUser = await UserSchema.findById(otherUserId)
      if (!otherUser) {
        return res.status(404).send({
          status: 'failure',
          message: 'Other User Not Found',
        })
      }

      // Fetch details of the current user
      const currentUser = await UserSchema.findById(currentUserId)
      if (!currentUser) {
        return res.status(404).send({
          status: 'failure',
          message: 'Current User Not Found',
        })
      }

      console.log(currentUser)
      console.log(otherUser)

      // Check if chat already exists
      const existingChat = await ChatSchema.findOne({
        participants: { $all: [currentUserId, otherUserId] },
      })

      if (existingChat) {
        return res.status(200).send({
          status: 'success',
          message: 'Chat already exists',
          data: existingChat,
        })
      }

      //   Create a new chat
      const newChat = new ChatSchema({
        participants: [currentUserId, otherUserId],
        participantsNames: [currentUser.displayName, otherUser.displayName],
      })

      await newChat.save()

      res.status(200).send({
        status: 'success',
        message: 'Chat created successfully',
        data: newChat,
      })
    } catch (error) {
      return res.status(500).send({
        status: 'failure',
        message: error.message,
        error: error,
      })
    }
  }
}

export default ChatController
