import MessageSchema from '../Schemas/MessageSchema.js'

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
}

export default MessageController
