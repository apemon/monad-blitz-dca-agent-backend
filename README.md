# DCA Agent Backend

A NestJS backend application with SQLite3, TypeORM, and Telegram bot integration.

## Features

- **NestJS Framework**: Modern Node.js framework
- **SQLite3 Database**: Lightweight database with TypeORM
- **Telegram Bot**: Telegraf integration for Telegram bot functionality
- **TypeScript**: Full TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))

## Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_PATH=database.sqlite

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Getting Your Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the token provided by BotFather
5. Set the `TELEGRAM_BOT_TOKEN` environment variable with your token

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build the application
npm run build
```

## API Endpoints

### Health Check

- `GET /` - Basic health check

### Telegram Bot

- `POST /telegram/send-message` - Send message to Telegram chat
  ```json
  {
    "chatId": "123456789",
    "message": "Hello from the bot!"
  }
  ```
- `GET /telegram/bot-info` - Get bot information

## Telegram Bot Commands

The bot supports the following commands:

- `/start` - Start the bot
- `/help` - Show help message
- `/status` - Check bot status
- `/ping` - Test bot responsiveness

## Database

The application uses SQLite3 with TypeORM. The database file (`database.sqlite`) will be created automatically when you first run the application.

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── app.controller.ts      # Main app controller
├── app.module.ts         # Main app module
├── app.service.ts        # Main app service
├── main.ts              # Application entry point
├── telegram.controller.ts # Telegram API controller
├── telegram.module.ts    # Telegram module
└── telegram.service.ts   # Telegram bot service
```

## Getting Started with Telegram Bot

1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set the `TELEGRAM_BOT_TOKEN` environment variable
4. Start the application
5. Find your bot on Telegram and start chatting!

## License

This project is licensed under the MIT License.
