import { Worker } from 'bullmq'
import type { ConnectionOptions } from 'bullmq'
import { CreateUserUseCase } from '@layer'
import { getPrismaClient, PrismaUserRepository } from '@ts-project-template/db'
import { QUEUES } from './queues'
import { processCreateUser } from './processors/create-user.processor'

function getRedisConnection(): ConnectionOptions {
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  }
}

function bootstrap(): void {
  const connection = getRedisConnection()
  const prisma = getPrismaClient()
  const userRepository = new PrismaUserRepository(prisma)
  const createUserUseCase = new CreateUserUseCase(userRepository)

  const createUserWorker = new Worker(
    QUEUES.CREATE_USER,
    async (job) => processCreateUser(job, createUserUseCase),
    {
      connection,
      concurrency: Number(process.env.WORKER_CONCURRENCY ?? 5),
    },
  )

  createUserWorker.on('completed', (job) => {
    console.log(`Worker: job ${job.id} completed`)
  })

  createUserWorker.on('failed', (job, err) => {
    console.error(`Worker: job ${job?.id} failed`, err)
  })

  console.log('Batch workers started')
}

bootstrap()
