import { Controller, Post, Body, Get } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-message')
  async sendMessage(@Body() body: { chatId: string; message: string }) {
    try {
      await this.telegramService.sendMessage(body.chatId, body.message);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('bot-info')
  async getBotInfo() {
    try {
      const bot = this.telegramService.getBot();
      const botInfo = await bot.telegram.getMe();
      return {
        success: true,
        botInfo: {
          id: botInfo.id,
          username: botInfo.username,
          firstName: botInfo.first_name,
          canJoinGroups: botInfo.can_join_groups,
          canReadAllGroupMessages: botInfo.can_read_all_group_messages,
          supportsInlineQueries: botInfo.supports_inline_queries,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
