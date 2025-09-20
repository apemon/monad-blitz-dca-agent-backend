import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { kuruRouterAbi } from '../../abi/kuruRouter.abi';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class KuruService {
  private rpcUrl: string;
  private usdcAddress: string;
  private kuruRouterAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.rpcUrl = this.configService.get('wallet.rpcUrl');
    this.usdcAddress = this.configService.get('wallet.usdcAddress');
    this.kuruRouterAddress = this.configService.get('kuru.routerAddress');
  }

  async swap(privateKey: string, fromAmount: string) {
    const wallet = privateKeyToAccount(privateKey as `0x${string}`);
    const client = createWalletClient({
      transport: http(this.rpcUrl),
      account: wallet,
    });
  }
}
