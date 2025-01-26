import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
}));

// export default () => ({
//   environment: process.env.NODE_ENV || 'development',
//   database: {
//     host: process.env.DATABASE_HOST,
//     port: Number(process.env.DATABASE_PORT) || 5432,
//   },
// });
