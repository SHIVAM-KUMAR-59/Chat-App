import mongoose from 'mongoose'

// Define schema for storing user data.
const User = new mongoose.Schema(
  {
    // Unique username chosen by the user
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // User's unique email address
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Display name that will be shown publicly for the user
    displayName: {
      type: String,
      required: true,
    },
    // Hashed password for user authentication
    password: {
      type: String,
      required: true,
    },
    // Optional biography or description provided by the user
    bio: {
      type: String,
      required: false,
      default: '',
    },
    // URL of the user's profile image
    profileImage: {
      type: String,
      default: '',
    },
    // Flag to indicate if the account is deactivated by the user
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    // Flag to indicate if the account is deleted or marked for deletion
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

// Export the User model
export default mongoose.model('User', User)
