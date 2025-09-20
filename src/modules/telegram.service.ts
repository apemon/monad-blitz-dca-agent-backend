import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
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
      `;
      ctx.reply(helpText);
    });

    // // Status command
    // this.bot.command('status', (ctx) => {
    //   ctx.reply('Bot is running and ready! 🚀');
    // });

    // // Ping command
    // this.bot.command('ping', (ctx) => {
    //   ctx.reply('Pong! 🏓');
    // });

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
