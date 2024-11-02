import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // For both one-on-one and group, participants are required
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false, // Default is one-to-one chat; set to true for group chat
    },
    groupName: {
      type: String,
      default: null, // Only needed for group chats
    },
    bio: {
      type: String,
      default: null, // Only needed for group chats
    },
  },
  { timestamps: true },
)

export default mongoose.model('Chat', ChatSchema)
