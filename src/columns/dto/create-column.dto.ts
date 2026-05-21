import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do projeto é obrigatório' })
  projects_id: string;
  @IsString()
  @IsNotEmpty({ message: 'O nome da coluna é obrigatório' })
  @MaxLength(80, {
    message: 'O nome da coluna pode ter no máximo 80 caracteres',
  })
  name: string;
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color_hex deve estar no formato hexadecimal (#RRGGBB)',
  })
  color_hex: string;
  @IsInt({ message: 'A posição deve ser um número inteiro' })
  @Min(0, { message: 'A posição não pode ser negativa' })
  position: number;
  @IsString()
  @IsNotEmpty({ message: 'O ID do criador da coluna é obrigatório' })
  create_by: string;
}
