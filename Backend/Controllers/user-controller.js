import UserSchema from '../Schemas/UserSchema.js'
import jwt from 'jsonwebtoken'

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

  // Method to soft delete a user or deactivate
}

export default UserController
