import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { projects, projects_members, user } from 'src/db/schema';
import { eq } from 'drizzle-orm';

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

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(userId: string) {
    return 
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
