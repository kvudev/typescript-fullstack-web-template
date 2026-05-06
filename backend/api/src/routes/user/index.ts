// routes/user.routes.ts
import { Router } from 'express'
import * as userController from '@controllers/user/index.js'

const router: Router = Router()

router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)

export default router