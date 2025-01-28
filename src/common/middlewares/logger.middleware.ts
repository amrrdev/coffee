import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.time('request-response time');
    console.log(`NEW REQUEST: ${req.method}\ ${req.url} ON: ${new Date().toUTCString()}`);
    res.on('finish', () => console.timeEnd('request-response time'));
    next();
  }
}
