import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { validationSchema } from './common/configs/config.schema';
import { ResponseInterceptor } from './common/interceptors';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PaginationMiddleware } from './common/middleware/pagination.middleware';
import modules from './modules';
import { PrismaModule } from './modules/admin/prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: validationSchema,
      isGlobal: true
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    WinstonModule.forRoot({
      exitOnError: false,
      level: 'debug',
      format: format.combine(
        format.label({ label: process.env.PROJECT_NAME }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, label, timestamp }) => {
          return `[${label}] ${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [
        new transports.DailyRotateFile({
          maxSize: '70m',
          maxFiles: '30d',
          filename: `${process.env.LOG_PATH}/${process.env.PROJECT_NAME}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
        }),
        new transports.Console(),
      ],
    }),
    ...modules,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
