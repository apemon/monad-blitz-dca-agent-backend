import { registerAs } from '@nestjs/config';

export default registerAs('wallet', () => ({
  rpcUrl: process.env.RPC_URL,
  usdcAddress: process.env.USDC_ADDRESS,
}));
