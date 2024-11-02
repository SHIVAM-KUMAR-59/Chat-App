import { Router } from 'express'
import {
  checkDetails,
  checkDuplicateUser,
  findUser,
  generatePassword,
  verifyPassword,
  verifyToken,
} from '../Middlewares.js/auth-middleware.js'
import UserController from '../Controllers/user-controller.js'

const route = Router()

// Register User Route
route.post(
  '/api/user/register',
  checkDetails,
  checkDuplicateUser,
  generatePassword,
  UserController.resgisterUser,
)

// Login User Route
route.post(
  '/api/user/login',
  checkDetails,
  findUser,
  verifyPassword,
  UserController.loginUser,
)

// Get User Route
route.get('/api/user/:username', verifyToken, UserController.getUser)

export default route
