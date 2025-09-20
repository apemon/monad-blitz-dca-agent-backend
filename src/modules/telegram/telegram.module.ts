import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [UserModule, WalletModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
