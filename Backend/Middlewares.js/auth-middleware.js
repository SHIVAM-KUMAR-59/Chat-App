import UserSchema from '../Schemas/UserSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Middleware to validate user registration details
export const checkDetails = (req, res, next) => {
  // Destructure fields from the request body
  const { username, displayName, email, password, confirmPassword } = req.body

  // Check if all fields are provided
  if (!username || !displayName || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Please fill in all fields' })
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Passwords do not match' })
  }

  // Proceed to the next middleware if validation is successful
  next()
}

// Middleware to check for duplicate users
export const checkDuplicateUser = async (req, res, next) => {
  // Destructure username and email from the request body
  const { username, email } = req.body

  // Search for a user with the same username or email
  const user = await UserSchema.findOne({ $or: [{ username }, { email }] })

  // If a user is found or is deactivated, return an error response
  if (user && !user.isDeactivated) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Username or email already exists' })
  }

  // Proceed to the next middleware if no duplicate is found
  next()
}

// Middleware to find a user by username
export const findUser = async (req, res, next) => {
  // Destructure username from the request body
  const { username } = req.body

  if (!username) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Please provide a username' })
  }

  try {
    // Search for a user with the provided username
    const user = await UserSchema.findOne({ username: username })

    // If no user is found, return a 404 response
    if (!user || user.isDeactivated) {
      return res
        .status(404)
        .json({ status: 'failed', message: 'User not found' })
    }

    // Attach the found user to the request object for further use
    req.user = user

    // Proceed to the next middleware
    next()
  } catch (error) {
    // Handle any errors that occur during the user search
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error finding user', error })
  }
}

// Middleware to hash the user's password
export const generatePassword = async (req, res, next) => {
  // Destructure password from the request body
  const { password } = req.body

  try {
    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(12)

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt)

    // Attach the hashed password to the request object for further use
    req.hash = hashedPassword

    // Proceed to the next middleware
    next()
  } catch (error) {
    // Handle any errors that occur during password hashing
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error generating password', error })
  }
}

// Middleware to verify the user's password
export const verifyPassword = async (req, res, next) => {
  // Destructure password from the request body
  const { password } = req.body

  if (!password) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Password is required' })
  }

  try {
    // Compare the provided password with the stored hashed password
    const verifyPassword = await bcrypt.compare(password, req.user.password)

    // If the password does not match, return an unauthorized response
    if (!verifyPassword) {
      return res.status(401).send({
        status: 'failed',
        message: 'Invalid password',
      })
    }

    // Proceed to the next middleware if the password is verified
    next()
  } catch (error) {
    // Handle any errors that occur during password verification
    console.log(error.message)
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error verifying password', error })
  }
}

// Middleware to verify the user's token
export const verifyToken = async (req, res, next) => {
  // Check if the Authorization header exists and is in the correct format
  const header =
    req.headers.authorization && req.headers.authorization.split(' ')[1]

  // Return an error if the Authorization header is missing or malformed
  if (!header) {
    return res.status(401).send({
      status: 'failed',
      message: 'Unauthorized',
    })
  }

  const token = header
  console.log(token)

  // Check if the token was successfully extracted from the header
  if (!token) {
    return res.status(401).send({
      status: 'failed',
      message: 'Unauthorized',
    })
  }

  try {
    // Verify the token using the secret key stored in environment variables
    jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Extract the username from the route parameters
    const { username } = req.params

    // Find the user in the database based on the provided username
    const user = await UserSchema.findOne({ username: username })

    // Check if the user's account was deleted
    if (user.isDeactivated) {
      return res.status(401).send({
        status: 'failed',
        message: 'You account was deleted',
      }) // Return an error if the user has been deleted
    }

    // Attach the user object to the request object for access in the next middleware
    req.user = user

    // Call the next middleware or route handler
    next()
  } catch (error) {
    // Handle errors that occur during token verification or user lookup
    return res.status(500).json({
      status: 'failed',
      message: 'Error verifying token',
    })
  }
}
