import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Module({
  imports: [],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
