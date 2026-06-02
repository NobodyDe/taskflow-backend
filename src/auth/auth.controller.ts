import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CheckEmaildto } from './dto/check-email.dto';
import { LoginDto } from './dto/loginDto.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-account')
  async createAccount(
    @Body() dto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.createAccount(dto);

    res
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', access_token, {
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  }

  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmaildto) {
    try {
      return this.authService.checkEmail(dto.email);
    } catch (error: unknown) {
      return new HttpException(
        (error as HttpException).message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('login')
  async signIn(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.singIn(dto);

    res
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', access_token, {
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const { access_token, refresh_token } =
      await this.authService.refreshToken(refreshToken);

    res
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', access_token, {
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
