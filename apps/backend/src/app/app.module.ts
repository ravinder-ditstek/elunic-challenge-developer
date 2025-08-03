import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserMessagesModule } from './user-messages/user-messages.module';

@Module({
  imports: [DatabaseModule, UserMessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
