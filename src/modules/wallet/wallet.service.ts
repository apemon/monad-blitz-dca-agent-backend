import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { erc20Abi } from '../../abi/erc20.abi';

@Injectable()
export class WalletService {
  private rpcUrl: string;
  private usdcAddress: string;
  private provider: ethers.providers.JsonRpcProvider;
  private usdcContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get('wallet.rpcUrl');
    this.usdcAddress = this.configService.get('wallet.usdcAddress');
    // Initialize the provider for Ethereum mainnet
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.usdcContract = new ethers.Contract(
      this.usdcAddress,
      erc20Abi,
      this.provider,
    );
  }

  async createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      privateKey: wallet.privateKey,
      walletAddress: wallet.address,
    };
  }

  async getWalletBalance(walletAddress: string) {
    try {
      const rawUsdcBalance = await this.usdcContract.balanceOf(walletAddress);
      const usdcBalance = ethers.utils.formatUnits(rawUsdcBalance, 6);
      // Get the balance in wei
      const balance = await this.provider.getBalance(walletAddress);
      const monadBalance = ethers.utils.formatEther(balance);

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
      const receipt = await this.provider.getTransactionReceipt(txhash);

      if (!receipt || receipt.status !== 1) {
        throw new Error('Transaction failed or not found');
      }

      // Parse event logs to find USDC Transfer events
      const transferLogs = receipt.logs.filter(
        (log) => log.address.toLowerCase() === this.usdcAddress.toLowerCase(),
      );

      const iface = new ethers.utils.Interface(erc20Abi);
      const parsedLogs = transferLogs
        .map((log) => {
          try {
            return iface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .filter((log) => log && log.name === 'Transfer');

      console.log(parsedLogs);
      const depositTransfer: any = parsedLogs.find(
        (log: any) =>
          log.args.to?.toLowerCase() === walletAddress.toLowerCase(),
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
