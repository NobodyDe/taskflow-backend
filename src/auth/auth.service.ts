import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async checkEmail(email: string) {
    const existUser = await this.drizzle.db.query.user.findFirst({
      where: eq(user.email, email),
      columns: { id: true },
    });

    return { exists: !!existUser };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
