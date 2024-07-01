import { ArgumentsHost, BadRequestException, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger();
  catch(originalException: Error, host: ArgumentsHost): void {
    let exception: HttpException = originalException as HttpException;
    let response: undefined | string | Record<string, any>;

    if (!(originalException instanceof HttpException)) {
      exception = new HttpException(originalException.message, HttpStatus.INTERNAL_SERVER_ERROR);
      exception.stack = originalException.stack;
    }

    if (originalException instanceof BadRequestException) {
      exception = new BadRequestException(response);
      exception.stack = originalException.stack;
      response = originalException.getResponse();
    }

    this.logger.error(`(${exception.getStatus()}) => ${exception.message}`, exception.stack);

    exception = new HttpException(
      {
        statusCode: exception.getStatus(),
        status: 'error',
        error: exception.message,
        data: response,
        timestamp: new Date().toISOString(),
      },
      exception.getStatus(),
    );

    super.catch(exception, host);
  }
}
