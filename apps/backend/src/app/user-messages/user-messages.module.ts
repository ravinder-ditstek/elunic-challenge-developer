import { Module } from '@nestjs/common';
import { UserMessagesService } from './user-messages.service';
import { UserMessagesController } from './user-messages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserMessagesController],
  providers: [UserMessagesService],
  exports: [UserMessagesService],
})
export class UserMessagesModule {} 