// Queue name constants — shared across producers and processors
export const QUEUES = {
  CREATE_USER: 'create-user',
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];
