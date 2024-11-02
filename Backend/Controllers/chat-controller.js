import ChatHelpers from '../Helpers/helpers.js'

/**
 * Controller class for handling chat-related operations
 */
class ChatController {
  /**
   * Create a private chat between two users
   */
  static createPrivateChat = async (req, res) => {
    try {
      const { userId: otherUserId } = req.body
      const currentUserId = req.user.id

      // Validate input
      if (!otherUserId) {
        return ChatHelpers.sendResponse(
          res,
          400,
          'failure',
          'User ID is required',
        )
      }

      // Get both users' details
      const [currentUser, otherUser] = await Promise.all([
        ChatHelpers.getUserById(currentUserId, 'Current User'),
        ChatHelpers.getUserById(otherUserId, 'Other User'),
      ])

      // Check for existing chat
      const existingChat = await ChatHelpers.findExistingChat(
        [currentUserId, otherUserId],
        false,
      )

      if (existingChat) {
        return ChatHelpers.sendResponse(
          res,
          200,
          'success',
          'Chat already exists',
          existingChat,
        )
      }

      // Create new chat
      const newChat = await ChatHelpers.createChat({
        participants: [currentUserId, otherUserId],
        participantsNames: [currentUser.displayName, otherUser.displayName],
      })

      return ChatHelpers.sendResponse(
        res,
        201,
        'success',
        'Chat created successfully',
        newChat,
      )
    } catch (error) {
      return ChatHelpers.sendResponse(res, 500, 'failure', error.message)
    }
  }

  /**
   * Create a group chat
   */
  static createGroupChat = async (req, res) => {
    try {
      const { name, bio, participants } = req.body
      const userId = req.user.id

      // Validate input
      if (!name || !participants) {
        return ChatHelpers.sendResponse(
          res,
          400,
          'failure',
          'Name and participants are required',
        )
      }

      const allParticipants = [...participants, userId]
      if (allParticipants.length < 3) {
        return ChatHelpers.sendResponse(
          res,
          400,
          'failure',
          'At least three participants are required',
        )
      }

      // Check if group already exists with same name and participants
      const existingGroup = await ChatHelpers.findExistingChat(
        allParticipants,
        true,
        name,
      )

      if (existingGroup) {
        return ChatHelpers.sendResponse(
          res,
          200,
          'success',
          'Group chat already exists',
          existingGroup,
        )
      }

      // Get participant names and create group
      const allParticipantNames = await ChatHelpers.getParticipantNames(
        allParticipants,
      )
      const newChatGroup = await ChatHelpers.createChat({
        participants: allParticipants,
        isGroupChat: true,
        groupName: name,
        bio: bio,
        participantsNames: allParticipantNames,
      })

      return ChatHelpers.sendResponse(
        res,
        201,
        'success',
        'Group chat created successfully',
        newChatGroup,
      )
    } catch (error) {
      return ChatHelpers.sendResponse(res, 500, 'failure', error.message)
    }
  }
}

export default ChatController
