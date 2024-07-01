import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    if (req.query.filter) {
      let temp = JSON.parse(req.query.filter as string);
      req.query.filter = temp;
    }
    if (req.query.sort) req.query.sort = JSON.parse(req.query.sort as string);
    next();
  }
}
