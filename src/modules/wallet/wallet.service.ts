import { Injectable } from '@nestjs/common';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class WalletService {
  constructor() {}

  async createWallet() {
    const privateKey = generatePrivateKey();
    const wallet = privateKeyToAccount(privateKey);
    return {
      privateKey,
      walletAddress: wallet.address,
    };
  }
}
