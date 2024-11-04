import MessageSchema from '../Schemas/MessageSchema.js'

class MessageController {
  static sendMessage = async (req, res) => {
    // Destructure all the details
    const { chatId, content, media, replyTo } = req.body
    const sender = req.user.id.toString()

    if (!chatId) {
      return res.status(401).send({
        status: 'failure',
        message: 'ChatId is required',
      })
    }

    if ((!content || content === '') && !media) {
      return res.status(401).send({
        status: 'failure',
        message: 'Empty messages cannot be sent',
      })
    }

    try {
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
      return res.status(401).send({
        status: 'failure',
        message: 'Error sending message',
      })
    }
  }
}

export default MessageController
