import { Module } from '@nestjs/common';
import { DatabaseService } from './db-service.service';

@Module({
  providers: [DatabaseService],
  exports : [DatabaseService]
})
export class DbServiceModule {}

