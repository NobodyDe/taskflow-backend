import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MaxLength(80, {
    message: 'O primeiro nome pode ter no máximo 80 caracteres',
  })
  @IsNotEmpty({ message: 'O primeiro nome do usuário é obrigatório' })
  first_name: string;

  @IsString()
  @MaxLength(80, {
    message: 'O segundo nome pode ter no máximo 80 caracteres',
  })
  @IsNotEmpty({ message: 'O segundo nome é obrigatório' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2, {
    message: 'As iniciais não podem ultrapassar 2 caracteres',
  })
  initials: string;

  @IsString()
  @IsNotEmpty({ message: 'A posição é obrigatório' })
  @MaxLength(80, {
    message: 'A posição pode ter no máximo 80 caracteres',
  })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'O color rex é obrigatório' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color_hex deve estar no formato hexadecimal (#RRGGBB)',
  })
  color_hex: string;

  @IsEmail()
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @MaxLength(80, {
    message: 'O email pode ter no máximo 80 caracteres',
  })
  email: string;

  @IsString({ message: 'A senha é obrigatório' })
  @MinLength(8)
  password: string;
}
