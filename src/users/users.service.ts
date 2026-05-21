import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findById(id: string) {
    const User = await this.drizzle.db.query.user.findFirst({
      where: eq(user.id, id),
      // with: {
      //   // 1º Nível: Relação de membros do projeto
      //   projects_members: {
      //     with: {
      //       // 2º Nível: O projeto em si
      //       projects: {
      //         with: {
      //           // 3º Nível: Colunas do projeto ordenadas por posição
      //           columns: {
      //             orderBy: (cols, { asc }) => [asc(cols.position)],
      //             with: {
      //               // 4º Nível: Cards das colunas ordenados por posição
      //               cards: {
      //                 orderBy: (c, { asc }) => [asc(c.position)],
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    });

    if (!User) throw new NotFoundException('User not founded');

    return User;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
