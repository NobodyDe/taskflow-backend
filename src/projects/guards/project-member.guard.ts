import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DrizzleService } from 'src/db/drizzle.provider';
import { projects, projects_members } from 'src/db/schema';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private readonly drizzle: DrizzleService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId as string | null;
    const projectId = (request.body?.projectId ??
      request.query?.projectId ??
      request.params?.projectId) as string | null;

    if (!userId || !projectId) {
      throw new ForbiddenException('Dados insuficients');
    }

    const isOwner = await this.drizzle.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.owner_id, userId)),
      columns: { id: true },
    });

    if (isOwner) return true;
    const isMember = await this.drizzle.db.query.projects_members.findFirst({
      where: and(
        eq(projects_members.projects_id, projectId), // nesse projeto
        eq(projects_members.users_id, userId), // esse usuário
      ),
      columns: { id: true },
    });

    if (isMember) return true;

    throw new ForbiddenException(
      'Você não tem permissão para acessar este projeto',
    );
  }
}
