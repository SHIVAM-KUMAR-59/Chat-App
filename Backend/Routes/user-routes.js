import { Router } from 'express'
import {
  checkDetails,
  checkDuplicateUser,
  findUser,
  generatePassword,
  verifyPassword,
} from '../Middlewares.js/auth-middleware.js'
import UserController from '../Controllers/user-controller.js'

const route = Router()

route.post(
  '/api/user/register',
  checkDetails,
  checkDuplicateUser,
  generatePassword,
  UserController.resgisterUser,
)

route.post(
  '/api/user/login',
  checkDetails,
  findUser,
  verifyPassword,
  UserController.loginUser,
)

export default route
