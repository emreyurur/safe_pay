import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbServiceModule } from 'src/db-service/db-service.module';

@Module({
  imports : [DbServiceModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
