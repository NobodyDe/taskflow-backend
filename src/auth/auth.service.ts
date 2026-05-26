import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly jwtService: JwtService,
  ) {}

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

  async singIn(
    dto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const foundedUser = await this.drizzle.db.query.user.findFirst({
      where: eq(user.email, dto.email),
    });

    if (!foundedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      foundedUser.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: foundedUser.id, email: foundedUser.email };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
