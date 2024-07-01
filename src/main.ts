import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/exception';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidateErrorsFormToResponse } from './common/shared/util/util-error';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT;
  const STAGE = process.env.STAGE;
  const app = await NestFactory.create(AppModule);

  app.use(requestIp.mw());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


  /************************************
   * CORS
   ************************************/
  const whitelist = process.env.ALLOWED_URL.split(',');

  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || STAGE === "DEV") {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      exceptionFactory: (errors) => {
        logger.log(errors);
        return new BadRequestException(ValidateErrorsFormToResponse(errors));
      },
    }),
  );

  app.useGlobalInterceptors(new TimeoutInterceptor());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });


  /******** Swagger config ********/

  const config = new DocumentBuilder()
    .setTitle(`${process.env.PROJECT_NAME}`)
    .setDescription(`EndPoints para la aplicación ${process.env.PROJECT_NAME}`)
    .setVersion(process.env.VERSION)
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port).then(() => {
    logger.log(`Aplicación corriendo en el puerto ${port} STAGE: ${STAGE}`);
    logger.log(`################### PUERTO: ${port} ###################`);
  });
}
bootstrap();
