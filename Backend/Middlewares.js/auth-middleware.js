import UserSchema from '../Schemas/UserSchema.js'
import bcrypt from 'bcrypt'

export const checkDetails = (req, res, next) => {
  const { username, displayName, email, password, confirmPassword } = req.body
  if (!username || !displayName || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Please fill in all fields' })
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Passwords do not match' })
  }

  next()
}

export const checkDuplicateUser = async (req, res, next) => {
  const { username, email } = req.body
  const user = await UserSchema.findOne({ $or: [{ username }, { email }] })
  if (user) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Username or email already exists' })
  }
  next()
}

export const findUser = async (req, res, next) => {
  const { username } = req.body
  try {
    const user = await UserSchema.findOne({ username: username })
    if (!user) {
      return res
        .status(404)
        .json({ status: 'failed', message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error finding user', error })
  }
}

export const generatePassword = async (req, res, next) => {
  const { password } = req.body
  try {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    req.hash = hashedPassword
    next()
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error generating password', error })
  }
}

export const verifyPassword = async (req, res, next) => {
  const { password } = req.body
  try {
    const verifyPassword = await bcrypt.compare(password, req.user.password)

    if (!verifyPassword) {
      return res.status(401).send({
        status: 'failed',
        message: 'Invalid password',
      })
    }

    next()
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'failed', message: 'Error verifying password', error })
  }
}
