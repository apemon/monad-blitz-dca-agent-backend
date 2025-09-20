import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { WalletService } from '../wallet/wallet.service';
import { Deposit } from '../../entities/deposit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
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

  async getUserByTelegramId(telegramId: string) {
    return await this.userRepository.findOne({
      where: { telegramId },
    });
  }

  async deposit(telegramId: string, txhash: string) {
    const user = await this.getUserByTelegramId(telegramId);
    // check if the deposit already exists
    const existingDeposit = await this.depositRepository.findOne({
      where: { txhash },
    });
    if (existingDeposit) {
      throw new Error('Deposit already exists');
    }
    const usdcDepositAmount = await this.walletService.getUsdcDepositAmount(
      user.walletAddress,
      txhash,
    );
    const newDeposit = this.depositRepository.create({
      userId: user.id,
      txhash,
      amount: usdcDepositAmount.usdcDepositAmount.toString(),
    });
    await this.depositRepository.save(newDeposit);
    // update user's usdc balance
    const newUsdcBalance =
      BigInt(user.usdcBalance) + BigInt(usdcDepositAmount.usdcDepositAmount);
    user.usdcBalance = newUsdcBalance.toString();
    await this.userRepository.save(user);
    return newDeposit;
  }

  async getBalance(telegramId: string) {
    const user = await this.getUserByTelegramId(telegramId);
    return {
      usdcBalance: user.usdcBalance,
      monadBalance: user.monadBalance,
    };
  }
}
