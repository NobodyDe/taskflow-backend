import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { user } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto.dto';
import { JwtService } from '@nestjs/jwt';

type AuthPayload = {
  sub: string;
  email: string;
};

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

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
    const userEmailExist = await this.drizzle.db.query.user.findFirst({
      where: eq(user.email, email),
      columns: { id: true },
    });

    return { userEmailExist: !!userEmailExist };
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
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<AuthPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const foundedUser = await this.drizzle.db.query.user.findFirst({
        where: eq(user.id, payload.sub),
      });

      if (!foundedUser) {
        throw new UnauthorizedException();
      }
      const NewPayload = { sub: foundedUser.id, email: foundedUser.email };

      const access_token = this.jwtService.sign(NewPayload, {
        expiresIn: '15m',
      });

      const refresh_token = this.jwtService.sign(NewPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return { access_token, refresh_token };
    } catch {
      throw new UnauthorizedException(
        'token de atualização inválido ou expirado',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
