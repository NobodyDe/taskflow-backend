import { PartialType } from '@nestjs/mapped-types';
import { CurrentUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CurrentUserDto) {}
