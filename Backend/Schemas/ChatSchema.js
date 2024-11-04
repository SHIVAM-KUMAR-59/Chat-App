import mongoose from 'mongoose'

// Define the schema for a Chat, which includes both one-on-one and group chats.
const ChatSchema = new mongoose.Schema(
  {
    // Array of participant IDs (required for both one-on-one and group chats)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // At least one participant is required
      },
    ],

    // Array of participant names, useful for quick access/display in chat UIs
    participantsNames: [
      {
        type: String,
        required: true, // Names are required for identifying participants
      },
    ],

    // Flag indicating if the chat is a group chat
    isGroupChat: {
      type: Boolean,
      default: false, // Defaults to false (one-to-one chat)
    },

    // Group name, only applicable if the chat is a group chat
    groupName: {
      type: String,
      default: null, // Null for one-to-one chat, should be set for group chats
    },

    // Bio or description of the group, applicable only for group chats
    bio: {
      type: String,
      default: null, // Null for one-to-one chat, can contain a description for group chats
    },

    // Profile image URL for the group, only relevant for group chats
    profileImage: {
      type: String,
      default: null, // Null for one-to-one chat, URL for group chats if set
    },

    // Array of admin IDs for the group, only applicable for group chats
    adminId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Null for one-to-one chats, populated for group chats with admin roles
      },
    ],

    // Array of admin names, useful for quickly identifying group chat admins
    adminNames: [
      {
        type: String,
        default: null, // Null for one-to-one chat, contains names for group chat admins
      },
    ],
  },
  {
    // Automatically includes `createdAt` and `updatedAt` timestamps for each document
    timestamps: true,
  },
)

// Export the Chat model based on the ChatSchema for use in the application
export default mongoose.model('Chat', ChatSchema)
