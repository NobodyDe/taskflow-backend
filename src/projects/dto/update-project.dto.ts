import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color_hex?: string;
}
