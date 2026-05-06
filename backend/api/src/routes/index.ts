import { Router } from 'express'
import userRouter from '@routes/user/index.js'

const router: Router = Router()

router.use('/users', userRouter)

export default router