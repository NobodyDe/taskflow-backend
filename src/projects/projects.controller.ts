import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDto } from 'src/users/dto/create-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: CurrentUserDto) {
    return this.projectsService.findAllByUser(user.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, ProjectMemberGuard)
  update(@Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(
      updateProjectDto.projectId,
      updateProjectDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
