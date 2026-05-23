import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  initials: string;
  @IsString()
  position: string;
  @IsString()
  color_hex: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}
