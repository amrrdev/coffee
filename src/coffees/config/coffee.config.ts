import { registerAs } from '@nestjs/config';

export default registerAs('coffee', () => ({
  foo: process.env.FOO,
  name: 'amr',
}));
