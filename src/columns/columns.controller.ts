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
  UseGuards,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectMemberGuard } from 'src/projects/guards/project-member.guard';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }
  // GET /columns?projectId=xxx
  @Get()
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  findAll(@Query('projectId') projectId: string) {
    return this.columnsService.findAllByProject(projectId);
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
