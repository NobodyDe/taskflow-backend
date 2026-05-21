import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }
  // GET /columns?projectId=xxx
  @Get()
  findAll(
    @Query('projectId') projectId: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!projectId) {
      throw new BadRequestException(
        'O parametro projectId é obrigatorio na query string.',
      );
    }
    if (!userId) {
      throw new BadRequestException('O header x-user-id é obrigatorio.');
    }
    return this.columnsService.findAllByProject(projectId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}
