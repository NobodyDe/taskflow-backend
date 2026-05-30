import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/db/drizzle.provider';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(CurrentUserDto) {
    return `This action adds a new ${CurrentUserDto}}user`;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findById(userId: string) {
    const foundeduser = await this.drizzle.db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { password_hash: false },
    });

    if (!foundeduser) throw new NotFoundException('Usuário não encontrado');

    return foundeduser;
  }

  update() {
    return `This action updates a  user`;
  }

  remove() {
    return `This action removes a user`;
  }
}
