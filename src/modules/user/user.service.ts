import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private walletService: WalletService,
  ) {}

  async createUser(telegramId: string) {
    const { privateKey, walletAddress } =
      await this.walletService.createWallet();
    const newUser = this.userRepository.create({
      telegramId,
      privateKey,
      walletAddress,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
