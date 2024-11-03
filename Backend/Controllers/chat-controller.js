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
      const { name, bio, participants, profileImage } = req.body
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

      const admin = await ChatHelpers.getUserById(userId)
      // Create new chat
      const newChatGroup = await ChatHelpers.createChat({
        participants: allParticipants,
        isGroupChat: true,
        groupName: name,
        bio: bio,
        participantsNames: allParticipantNames,
        profileImage: profileImage,
        adminId: admin._id.toString(),
        adminNames: admin.displayName,
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

  /**
   * Add or remove participants in a group chat
   */
  static updateChatParticipants = async (req, res) => {
    const userId = req.user.id
    const { chatId } = req.params
    const { participants, action } = req.body

    if (!participants || !action) {
      return ChatHelpers.sendResponse(
        res,
        400,
        'failure',
        'Invalid information',
      )
    }

    if (!chatId) {
      return ChatHelpers.sendResponse(
        res,
        400,
        'failure',
        'Chat ID is required',
      )
    }
    const chat = await ChatHelpers.findChat(req.params.chatId)

    // Find the chat
    if (!chat) {
      return ChatHelpers.sendResponse(res, 404, 'failure', 'No chat is found')
    }

    // // Check if the chat is a private chat
    // if (chat.isGroupChat === false) {
    //   return ChatHelpers.sendResponse(
    //     res,
    //     400,
    //     'failure',
    //     'You can only add/delete users in group chats',
    //   )
    // }

    // if (!chat.adminId.toString() === userId) {
    //   return ChatHelpers.sendResponse(
    //     res,
    //     400,
    //     'failure',
    //     'You are not the admin',
    //   )
    // }

    // // Check if the participants exist or not
    // const participantsId = await Promise.all(
    //   participants.map(async (participant) => {
    //     return await ChatHelpers.getUserById(participant)
    //   }),
    // )

    // // Check if the user is already present in the group
    // participantsId.filter((id) => !chat.participants.includes(id))

    // const participantNames = await ChatHelpers.getParticipantNames(
    //   participantsId,
    // )

    res.sendStatus(200)
  }
}

export default ChatController
