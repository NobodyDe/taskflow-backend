import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDto } from 'src/users/dto/create-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

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

  // @Patch(':id')
  // update(
  //   @CurrentUser() user: CurrentUserDto,
  //   @Body() updateProjectDto: UpdateProjectDto,
  // ) {
  //   return this.projectsService.update();
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
