import { User } from '@news-summarizer/layer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt.toISOString();
  }
}
