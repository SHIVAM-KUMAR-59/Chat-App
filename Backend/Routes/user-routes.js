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

// Get all Users Route
route.get('/api/user', UserController.getAllUsers)

// Get a particular User Route
route.get('/api/user/:username', verifyToken, UserController.getUser)

// Toggle activate and deactivate user
route.patch(
  '/api/user/:username/deactivate',
  UserController.toggleUserActivation,
)

// Patch Route to change any field except password
route.patch('/api/user/:username', verifyToken, UserController.updateUser)

// Delete Route to delete the user from the database
route.delete('/api/user/:username', verifyToken, UserController.deleteUser)

export default route
