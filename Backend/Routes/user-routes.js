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
  '/api/auth/register',
  checkDetails,
  checkDuplicateUser,
  generatePassword,
  UserController.resgisterUser,
)

// Login User Route
route.post(
  '/api/auth/login',
  checkDetails,
  findUser,
  verifyPassword,
  UserController.loginUser,
)

// Get User Route
route.get('/api/user/:username', verifyToken, UserController.getUser)

// Soft Delete or Deactivate a user
route.patch(
  '/api/user/:username/deactivate',
  UserController.toggleUserActivation,
)

export default route
