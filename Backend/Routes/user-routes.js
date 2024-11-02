import { Router } from 'express'
import {
  checkDetails,
  checkDuplicateUser,
  generatePassword,
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

export default route
