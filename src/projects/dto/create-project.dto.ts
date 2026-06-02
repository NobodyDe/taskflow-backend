import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
