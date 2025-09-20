import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { ethers } from 'ethers';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private walletService: WalletService,
  ) {
    const token = this.configService.get('telegram.token');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
    }
    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.start((ctx) => {
      ctx.reply(
        'Welcome! I am your DCA Agent Bot. Use /help to see available commands.',
      );
    });

    // Help command
    this.bot.help((ctx) => {
      const helpText = `
Available commands:
/start - Start the bot
/help - Show this help message
/status - Check bot status
/ping - Test bot responsiveness
/new - Create a new wallet
/balance - Check your wallet balance
      `;
      ctx.reply(helpText);
    });

    this.bot.command('new', async (ctx) => {
      try {
        const user = await this.userService.createUser(ctx.from.id.toString());
        console.log(user);
        ctx.reply(`new wallet created: ${user.walletAddress}.`);
      } catch (error) {
        console.error('Failed to create user:', error);
        ctx.reply('Sorry, something went wrong!');
      }
    });

    this.bot.command('balance', async (ctx) => {
      try {
        const telegramId = ctx.from.id.toString();
        const user = await this.userService.getUserByTelegramId(telegramId);

        if (!user) {
          ctx.reply("You don't have a wallet yet. Use /new to create one.");
          return;
        }

        ctx.reply(
          `💰 Wallet Balance\n` +
            `Address: ${user.walletAddress}\n` +
            `NAD: ${ethers.utils.formatEther(user.monadBalance)}\n` +
            `USDC: ${ethers.utils.formatUnits(user.usdcBalance, 6)}`,
        );
      } catch (error) {
        console.error('Failed to get wallet balance:', error);
        ctx.reply(
          'Sorry, failed to get wallet balance. Please try again later.',
        );
      }
    });

    this.bot.command('deposit', async (ctx) => {
      try {
        const telegramId = ctx.from.id.toString();
        const user = await this.userService.getUserByTelegramId(telegramId);
        if (!user) {
          ctx.reply("You don't have a wallet yet. Use /new to create one.");
          return;
        }
        const txhash = ctx.message.text.split(' ')[1];
        await this.userService.deposit(telegramId, txhash);
        ctx.reply('Deposit successful!');
      } catch (error) {
        console.error('Failed to deposit:', error);
        ctx.reply('Sorry, failed to deposit. Please try again later.');
      }
    });

    // // Handle text messages
    // this.bot.on('text', (ctx) => {
    //   const message = ctx.message.text;
    //   ctx.reply(`You said: "${message}"`);
    // });

    // Error handling
    this.bot.catch((err, ctx) => {
      console.error('Bot error:', err);
      ctx.reply('Sorry, something went wrong!');
    });
  }

  async onModuleInit() {
    try {
      await this.bot.launch();
      console.log('Telegram bot started successfully');
    } catch (error) {
      console.error('Failed to start Telegram bot:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.bot.stop();
      console.log('Telegram bot stopped');
    } catch (error) {
      console.error('Error stopping Telegram bot:', error);
    }
  }

  // Method to send message to a specific chat
  async sendMessage(chatId: string | number, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Method to get bot instance for advanced usage
  getBot() {
    return this.bot;
  }
}
