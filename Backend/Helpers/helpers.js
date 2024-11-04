import ChatSchema from '../Schemas/ChatSchema.js'
import UserSchema from '../Schemas/UserSchema.js'

// Class of helper functions
class ChatHelpers {
  /**
   * Get user details by ID
   * @param {string} userId - User ID to fetch
   * @param {string} userType - Type of user (for error message)
   * @returns {Object} User object or throws error
   */
  static async getUserById(userId, userType = 'User') {
    const user = await UserSchema.findById(userId)
    if (!user) {
      return res.status(404).send({
        message: 'User Not Found',
      })
    }
    return user
  }

  /**
   * Get names of all participants
   * @param {Array} participantIds - Array of participant IDs
   * @returns {Array} Array of participant names
   */
  static async getParticipantNames(participantIds) {
    const participantNames = []
    for (const id of participantIds) {
      const participant = await UserSchema.findById(id)
      if (participant) {
        participantNames.push(participant.displayName)
      }
    }
    return participantNames
  }

  /**
   * Check if chat exists between participants
   * @param {Array} participantIds - Array of participant IDs
   * @param {boolean} isGroupChat - Whether checking for group chat
   * @param {string} groupName - Optional group name for group chat check
   * @returns {Object|null} Existing chat or null
   */
  static async findExistingChat(
    participantIds,
    isGroupChat = false,
    groupName = null,
  ) {
    const query = {
      participants: {
        $all: participantIds,
        $size: participantIds.length,
      },
      isGroupChat: isGroupChat,
    }

    // For group chats, also check the group name
    if (isGroupChat && groupName) {
      query.groupName = groupName
    }

    return await ChatSchema.findOne(query)
  }

  /**
   * Create new chat instance
   * @param {Object} chatData - Chat creation data
   * @returns {Object} New chat instance
   */
  static async createChat(chatData) {
    const newChat = new ChatSchema(chatData)
    await newChat.save()
    return newChat
  }

  /**
   * Send standardized response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} status - Success or failure
   * @param {string} message - Response message
   * @param {Object} data - Optional data to send
   */
  static sendResponse(res, statusCode, status, message, data = null) {
    const response = {
      status,
      message,
    }
    if (data) {
      response.data = data
    }
    return res.status(statusCode).send(response)
  }

  static findChat = async (chatId) => {
    // Find Chat
    const chat = await ChatSchema.findById(chatId)
    return chat
  }
}

export default ChatHelpers
