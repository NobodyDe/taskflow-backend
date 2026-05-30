import { IsNotEmpty, IsString } from 'class-validator';

export class CurrentUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
