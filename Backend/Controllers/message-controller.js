import MessageSchema from '../Schemas/MessageSchema.js'

// Class to handle messages
class MessageController {
  // Method to send messages
  static sendMessage = async (req, res) => {
    // Destructure all the details
    const { chatId, content, media, replyTo } = req.body
    const sender = req.user.id.toString()

    // Check if the chatId is present
    if (!chatId) {
      return res.status(401).send({
        status: 'failure',
        message: 'ChatId is required',
      })
    }

    // Check if an empty message is not being sent
    if ((!content || content === '') && !media) {
      return res.status(401).send({
        status: 'failure',
        message: 'Empty messages cannot be sent',
      })
    }

    try {
      // Create a new message in the database
      const newMessage = await MessageSchema.create({
        chatId,
        sender,
        content,
        media,
        replyTo,
      })

      res.status(201).send({
        status: 'success',
        message: 'Message created successfully',
        data: newMessage,
      })
    } catch (error) {
      // Send error message
      return res.status(401).send({
        status: 'failure',
        message: 'Error sending message',
      })
    }
  }

  // Method to get messages
  static getMessages = async (req, res) => {
    const chatId = req.params.chatId

    // Check if chatId is present
    if (!chatId) {
      return res.status(401).send({
        status: 'failure',
        message: 'ChatId is required',
      })
    }

    try {
      // Fetch messages from the database
      const messages = await MessageSchema.find({ chatId })

      res.status(200).send({
        status: 'success',
        message: 'Messages fetched successfully',
        data: messages,
      })
    } catch (error) {
      // Send error message
      return res.status(401).send({
        status: 'failure',
        message: 'Error fetching messages',
      })
    }
  }

  // Method to delete a message
  static deleteMessage = async (req, res) => {
    const { messageId } = req.params

    if (!messageId) {
      return res.status(401).send({
        status: 'failure',
        message: 'MessageId is required',
      })
    }

    try {
      // Find message from the database
      const message = await MessageSchema.findById(messageId)
      // Check if message is present
      if (!message) {
        return res.status(401).send({
          status: 'failure',
          message: 'Message not found',
        })
      }

      // Check if the person deleting is the one who sent the message
      if (message.sender.toString() !== req.user.id.toString()) {
        return res.status(401).send({
          status: 'failure',
          message: 'You are not authorized to delete this message',
        })
      }

      // Delete the message
      await MessageSchema.findByIdAndDelete(messageId)

      res.status(200).send({
        status: 'success',
        message: 'Message was deleted successfully',
      })
    } catch (error) {
      return res.status(500).send({
        status: 'failure',
        message: 'Error deleting message',
      })
    }
  }
}

export default MessageController
