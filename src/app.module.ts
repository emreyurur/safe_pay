import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './db-service/db-service.service';
import { DbServiceModule } from './db-service/db-service.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ DbServiceModule, UserModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
