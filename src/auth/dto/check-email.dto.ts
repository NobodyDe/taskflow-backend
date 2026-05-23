import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmaildto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
