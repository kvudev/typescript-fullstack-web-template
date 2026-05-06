// controllers/user.controller.ts
import type { Request, Response } from 'express'

export const getUsers = (req: Request, res: Response) => {
  res.json([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ])
}

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params

  res.json({
    id,
    name: `User ${id}`,
  })
}