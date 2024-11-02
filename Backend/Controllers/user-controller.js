import UserSchema from '../Schemas/UserSchema.js'
import jwt from 'jsonwebtoken'

class UserController {
  static resgisterUser = async (req, res) => {
    const { username, displayName, email, bio, profileImage } = req.body
    try {
      const newUser = await new UserSchema({
        username,
        displayName,
        email,
        password: req.hash,
        bio,
        profileImage,
      }).save()
      const token = jwt.sign(
        {
          id: newUser._id,
          username: newUser.username,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        },
      )
      console.log(token)
      res.status(200).send({
        status: 'success',
        message: 'User created successfully',
        data: newUser,
      })
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: 'Error creating user',
        data: error,
      })
    }
  }

  static loginUser = async (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        username: req.user.username,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      },
    )
    console.log(token)
    if (token) {
      return res.status(200).send({
        status: 'success',
        message: 'User logged in successfully',
        data: {
          token: token,
          user: req.user,
        },
      })
    } else {
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid credentials',
      })
    }
  }
}

export default UserController
