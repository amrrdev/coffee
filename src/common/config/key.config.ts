import { registerAs } from '@nestjs/config';

export default registerAs('keyConfigrations', () => ({
  API_KEY: process.env.API_KEY,
}));
