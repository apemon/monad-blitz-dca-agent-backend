import { Injectable } from '@nestjs/common';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, formatUnits, http, parseEventLogs } from 'viem';
import { ConfigService } from '@nestjs/config';
import { erc20Abi } from '../../abi/erc20.abi';

@Injectable()
export class WalletService {
  private rpcUrl: string;
  private usdcAddress: string;
  private client;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get('wallet.rpcUrl');
    this.usdcAddress = this.configService.get('wallet.usdcAddress');
    // Initialize the public client for Ethereum mainnet
    this.client = createPublicClient({
      transport: http(this.rpcUrl),
    });
  }

  async createWallet() {
    const privateKey = generatePrivateKey();
    const wallet = privateKeyToAccount(privateKey);
    return {
      privateKey,
      walletAddress: wallet.address,
    };
  }

  async getWalletBalance(walletAddress: string) {
    try {
      const rawUsdcBalance = await this.client.readContract({
        address: this.usdcAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      });
      const usdcBalance = formatUnits(rawUsdcBalance, 6);
      // Get the balance in wei
      const balance = await this.client.getBalance({
        address: walletAddress as `0x${string}`,
      });
      const monadBalance = formatUnits(balance, 18);

      return {
        address: walletAddress,
        usdcBalance,
        monadBalance,
      };
    } catch (error) {
      throw new Error(`Failed to get wallet balance: ${error.message}`);
    }
  }

  async getUsdcDepositAmount(walletAddress: string, txhash: string) {
    try {
      // Get transaction receipt from txhash
      const receipt = await this.client.getTransactionReceipt({
        hash: txhash as `0x${string}`,
      });

      if (!receipt || receipt.status !== 'success') {
        throw new Error('Transaction failed or not found');
      }

      // Parse event logs to find USDC Transfer events
      const transferLogs = parseEventLogs({
        abi: erc20Abi,
        logs: receipt.logs,
        eventName: 'Transfer',
      });

      console.log(transferLogs);
      const depositTransfer: any = transferLogs.find(
        (log: any) =>
          log.args.to?.toLowerCase() === walletAddress.toLowerCase() &&
          log.address.toLowerCase() === this.usdcAddress.toLowerCase(),
      );
      const usdcDepositAmount = depositTransfer.args.value;
      return {
        usdcDepositAmount,
      };
    } catch (error) {
      throw new Error(`Failed to process deposit: ${error.message}`);
    }
  }
}
