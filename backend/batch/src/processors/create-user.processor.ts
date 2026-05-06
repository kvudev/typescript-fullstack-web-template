import { Job } from 'bullmq';
import { CreateUserUseCase, CreateUserInput } from '@news-summarizer/layer';

export async function processCreateUser(
  job: Job<CreateUserInput>,
  createUserUseCase: CreateUserUseCase,
): Promise<void> {
  const { name, email } = job.data;

  console.log(`[CreateUser] Processing job ${job.id} for email: ${email}`);

  // Idempotency: BullMQ will retry on failure; use-case handles duplicate email
  try {
    const result = await createUserUseCase.execute({ name, email });
    console.log(`[CreateUser] Job ${job.id} completed — userId: ${result.user.id}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // If user already exists, treat as success (idempotent)
    if (message.includes('already exists')) {
      console.log(`[CreateUser] Job ${job.id} skipped — user already exists`);
      return;
    }

    console.error(`[CreateUser] Job ${job.id} failed: ${message}`);
    throw err; // Re-throw so BullMQ retries
  }
}
