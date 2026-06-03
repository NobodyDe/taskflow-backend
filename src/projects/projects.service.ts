import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';

import { DrizzleService } from 'src/db/drizzle.provider';
import { projects, projects_members } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  async findAllByUser(userId: string) {
    const memberships = await this.drizzle.db.query.projects_members.findMany({
      where: eq(projects_members.users_id, userId),
      with: {
        projects: true,
      },
    });
    return memberships.map((m) => m.projects);
  }

  async update(projectId: string, dto: UpdateProjectDto) {
    const { projectId: _id, ...updateData } = dto;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Nenhum campo para atualizar');
    }

    const [updatedProject] = await this.drizzle.db
      .update(projects)
      .set({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (!updatedProject) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return updatedProject;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
