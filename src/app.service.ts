import { DrizzleService } from './db/drizzle.provider';
import { Injectable } from '@nestjs/common';
import { user } from './db/schema/schema';
@Injectable()
export class AppService {
  constructor(private readonly drizzle: DrizzleService) {}
  listUsers() {
    return this.drizzle.db.select().from(user);
  }
}
