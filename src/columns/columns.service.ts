import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { DrizzleService } from 'src/db/drizzle.provider';
import { and, asc, eq } from 'drizzle-orm';
import { columns, projects_members } from 'src/db/schema';

@Injectable()
export class ColumnsService {
  constructor(private readonly drizzle: DrizzleService) {}

  create(createColumnDto: CreateColumnDto) {
    return 'This action adds a new column';
  }

  async findAllByProject(projectId) {
    return await this.drizzle.db.query.columns.findMany({
      where: eq(columns.projects_id, projectId),
      orderBy: [asc(columns.position)],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
