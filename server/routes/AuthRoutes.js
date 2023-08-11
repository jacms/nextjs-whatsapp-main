import { Router } from 'express'
import {
  checkUser,
  getAllUsers,
  onBoardUser
} from '../controllers/AuthController.js'

const routes = Router()

routes.post('/check-user', checkUser)
routes.post('/onboard-user', onBoardUser)
routes.get('/get-contacts', getAllUsers)

export default routes
