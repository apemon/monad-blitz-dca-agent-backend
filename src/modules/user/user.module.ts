import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { WalletModule } from '../wallet/wallet.module';
import { Deposit } from '../../entities/deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Deposit]), WalletModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
