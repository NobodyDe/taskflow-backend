import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.provider';

@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
