import { Module } from '@nestjs/common';
import { CryptService } from '../../utility/services/crypt.service';
import { UtilityModule } from '../../utility/utility.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserPrismaRepository } from './repository/user.repository';
import { UserCreateService } from './services/user-create.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    UtilityModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserCreateService,
    CryptService,
    UserPrismaRepository,
  ],
  exports: [UserService, UserCreateService]
})
export class UserModule { }
