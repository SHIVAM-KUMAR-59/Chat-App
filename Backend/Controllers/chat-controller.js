import ChatHelpers from '../Helpers/helpers.js'

/*
 * Controller class for handling chat-related operations
 */
class ChatController {
  /*
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

  /*
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

  /*
   * Add or remove participants in a group chat
   */
  static updateChatParticipants = async (req, res) => {
    const userId = req.user.id
    const { chatId } = req.params
    const { participants, action } = req.body

    // Validate input
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

    try {
      const chat = await ChatHelpers.findChat(chatId)

      if (!chat) {
        return ChatHelpers.sendResponse(res, 404, 'failure', 'Chat not found')
      }

      // Check if it's a group chat
      if (!chat.isGroupChat) {
        return ChatHelpers.sendResponse(
          res,
          400,
          'failure',
          'Cannot modify participants in a private chat',
        )
      }

      // Ensure user is admin
      if (chat.adminId.toString() !== userId) {
        return ChatHelpers.sendResponse(
          res,
          403,
          'failure',
          'You are not authorized to modify participants in this group',
        )
      }

      // Get participant details from the database
      const participantUsers = await Promise.all(
        participants.map(async (participantId) => {
          const user = await ChatHelpers.getUserById(participantId)
          return user
            ? { id: user._id.toString(), name: user.displayName }
            : null
        }),
      )

      if (action === 'add') {
        // Filter out already existing participants by ID
        const newParticipants = participantUsers.filter(
          (participant) =>
            !chat.participants.some(
              (existingId) =>
                existingId.toString() === participant.id.toString(),
            ),
        )

        // Add both IDs and names of new participants to the chat
        chat.participants.push(...newParticipants.map((p) => p.id))
        chat.participantsNames.push(...newParticipants.map((p) => p.name))
        await chat.save()

        return ChatHelpers.sendResponse(
          res,
          200,
          'success',
          'Participants added successfully',
          chat,
        )
      } else if (action === 'delete') {
        // Ensure only one user is being removed at a time
        if (participants.length !== 1) {
          return ChatHelpers.sendResponse(
            res,
            400,
            'failure',
            'Only one participant can be removed at a time',
          )
        }

        const participantIdToRemove = participants[0]
        const indexToRemove = chat.participants.indexOf(participantIdToRemove)

        // Check if the participant exists in the group
        if (indexToRemove === -1) {
          return ChatHelpers.sendResponse(
            res,
            404,
            'failure',
            'Participant not found in this group chat',
          )
        }

        // Remove the participant's ID and name from the chat
        chat.participants.splice(indexToRemove, 1)
        chat.participantsNames.splice(indexToRemove, 1)
        await chat.save()

        return ChatHelpers.sendResponse(
          res,
          200,
          'success',
          'Participant removed successfully',
          chat,
        )
      } else {
        return ChatHelpers.sendResponse(
          res,
          400,
          'failure',
          'Invalid action type',
        )
      }
    } catch (error) {
      return ChatHelpers.sendResponse(res, 500, 'failure', error.message)
    }
  }
}

export default ChatController
