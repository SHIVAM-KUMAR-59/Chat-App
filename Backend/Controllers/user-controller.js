import UserSchema from '../Schemas/UserSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class UserController {
  // Method to register a new user
  static resgisterUser = async (req, res) => {
    // Destructure the required fields from the request body
    const { username, displayName, email, bio, profileImage } = req.body

    try {
      // Create a new user instance and save it to the database
      const newUser = await new UserSchema({
        username,
        displayName,
        email,
        password: req.hash, // The password should be hashed before saving
        bio,
        profileImage,
      }).save()

      // Generate a JWT token for the newly created user
      const token = jwt.sign(
        {
          id: newUser._id, // Include user ID in the token payload
        },
        process.env.JWT_SECRET_KEY, // Secret key for signing the token
        {
          expiresIn: process.env.JWT_EXPIRE_TIME, // Set expiration time from environment variable
        },
      )

      // Send a successful response with the user data and token
      res.status(200).send({
        status: 'success',
        message: 'User created successfully',
        token: token, // JWT token
        user: {
          _id: newUser._id, // Include user ID
          username: newUser.username, // Include username
          displayName: newUser.displayName, // Include display name
          email: newUser.email, // Include email
          bio: newUser.bio, // Include bio
          profileImage: newUser.profileImage, // Include profile image
        },
      })
    } catch (error) {
      // Handle any errors that occur during user creation
      res.status(400).send({
        status: 'error',
        message: 'Error creating user',
        data: error, // Send error details
      })
    }
  }

  // Method to log in an existing user
  static loginUser = async (req, res) => {
    // Generate a JWT token upon successful login
    const token = jwt.sign(
      {
        id: req.user._id, // Include user ID in the token payload
      },
      process.env.JWT_SECRET_KEY, // Secret key for signing the token
      {
        expiresIn: process.env.JWT_EXPIRE_TIME, // Set expiration time from environment variable
      },
    )
    console.log(token)

    // Check if the token was successfully generated
    if (token) {
      // Send a successful response with the token and user data
      return res.status(200).send({
        status: 'success',
        message: 'User logged in successfully',
        data: {
          token: token, // JWT token
          user: {
            _id: req.user._id, // Include user ID
            username: req.user.username, // Include username
            displayName: req.user.displayName, // Include display name
            email: req.user.email, // Include email
            bio: req.user.bio, // Include bio
            profileImage: req.user.profileImage, // Include profile image
          },
        },
      })
    } else {
      // Handle invalid credentials case
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid credentials', // Message indicating login failure
      })
    }
  }

  // Method to get a user's profile
  static getUser = async (req, res) => {
    if (!req.user) {
      return res.status(404).send({
        status: 'failure',
        message: 'User not found', // Message indicating user not found
      })
    }
    // Send a successful response with the user data
    return res.status(200).send({
      status: 'success',
      message: 'User profile retrieved successfully',
      data: {
        user: req.user,
      },
    })
  }

  // Method to Toggle between user's activation and deactivation
  static toggleUserActivation = async (req, res) => {
    const { username } = req.params

    const { password } = req.body

    if (!username) {
      return res.status(404).send({
        status: 'failed',
        message: 'Username required!', // Message indicating user not found
      })
    }

    if (!password) {
      return res.status(404).send({
        status: 'failed',
        message: 'Password required!', // Message indicating password not found
      })
    }

    try {
      // Find the user by username
      const user = await UserSchema.findOne({ username: username })

      // If user is not found, send a 404 response
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found',
        })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'failed',
          message: 'Invalid password',
        })
      }

      // Toggle the isDeactivated field
      const updatedUser = await UserSchema.findOneAndUpdate(
        { username: user.username },
        { isDeactivated: !user.isDeactivated }, // Toggle the isDeactivated state
        {
          new: true, // Return the updated document
          runValidators: true, // Run validation on the update
        },
      )

      // Successful response
      res.status(200).json({
        status: 'success',
        message: updatedUser.isDeactivated
          ? 'User deactivated successfully'
          : 'User activated successfully',
        user: updatedUser,
      })
    } catch (error) {
      // Handle any errors
      res.status(500).json({
        status: 'error',
        message: 'Error toggling user activation',
        error,
      })
    }
  }

  // Method to change any field except password
  static updateUser = async (req, res) => {
    // Destructure the data from the request body
    const { displayName, email, bio, profileImage } = req.body

    const id = req.user._id.toString() // Get the user ID from the request
    console.log(id)

    // Check if any data is provided
    if (!displayName && !email && !bio && !profileImage) {
      return res.status(400).json({
        status: 'failed',
        message: 'Enter at least one field.',
      })
    }

    try {
      // Find the user and update the specified fields
      const user = await UserSchema.findByIdAndUpdate(
        id, // Find user by user id directly
        {
          $set: {
            // Fields to update
            displayName,
            email,
            bio,
            profileImage,
          },
        },
        {
          // Options for the update operation
          new: true, // Return the updated document
          runValidators: true, // Run validation on the update
        },
      )

      // Check if the user was found and updated
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found',
        })
      }

      // Successful response
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        user, // Send the updated user information back
      })
    } catch (error) {
      // Handle any errors that occur during the update
      return res.status(500).json({
        status: 'failed',
        message: 'Error updating user',
        error: error.message,
      })
    }
  }
}

export default UserController
