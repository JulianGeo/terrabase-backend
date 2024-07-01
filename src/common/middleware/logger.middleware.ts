import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getClientIp } from 'request-ip';
import { Logger } from 'winston';
import { Util } from '../shared/util/util';

const MAX_ROW_LENGTH = 1000;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,

  ) { }

  async use(request: Request, response: Response, next: NextFunction) {


    const ip = getClientIp(request);
    const params = Object.values(request.params);
    const param = params.length ? `Params => ${JSON.stringify(params)} ` : '';
    const query = Object.keys(request.query).length
      ? `Query => ${JSON.stringify(request.query)} `
      : '';
    const body = Object.keys(request.body)?.length
      ? `Body => ${JSON.stringify(
        Util.objectMap(request.body, (v) =>
          JSON.stringify(v).length < MAX_ROW_LENGTH
            ? v
            : `${JSON.stringify(v).slice(0, MAX_ROW_LENGTH)}...`,
        ),
      )} `
      : ``;

    const message = `(${ip}) (${request.method
      }) (${params.shift()}) ${param}${query}${body}`;
    this.logger.info(`${message}`);
    next();
  }
}
