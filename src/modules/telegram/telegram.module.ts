import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
