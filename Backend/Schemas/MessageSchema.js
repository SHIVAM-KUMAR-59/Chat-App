import mongoose from 'mongoose'

// Define schema for storing messages in a chat
const MessageSchema = new mongoose.Schema(
  {
    // ID of the chat the message belongs to, referencing the Chat model
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    // ID of the user who sent the message, referencing the User model
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Text content of the message, required if no media is attached
    content: {
      type: String,
      required: function () {
        return !this.media // content is required if media is not present
      },
    },
    // Optional media attached to the message
    media: {
      // URL of the media file
      url: {
        type: String,
        default: null,
      },
      // Type of media, restricted to image, video, or null
      type: {
        type: String,
        enum: ['image', 'video', null],
        default: null,
      },
    },
    // Optional ID of the message being replied to, referencing the Message model
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Flag to mark if the message has been deleted
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Enable automatic creation of createdAt and updatedAt timestamps
    timestamps: true,
  },
)

// Export the Message model
export default mongoose.model('Message', MessageSchema)
