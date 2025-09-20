import { registerAs } from '@nestjs/config';

export default registerAs('kuru', () => ({
  routerAddress: process.env.KURU_ROUTER_ADDRESS,
}));
