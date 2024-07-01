import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { Logger } from 'winston';
import { UserPrismaRepository } from './repository/user.repository';

@Injectable()
export class UserService {

  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private cslService: ClsService,
    private userPrismaRepository: UserPrismaRepository,
  ) {

  }


  async getAllUsers(): Promise<Partial<User>[]> {
    this.logger.info('testing logger')
    const users = await this.userPrismaRepository.getAllUsers();
    return users;
  }



  async getUser({ email, enabled = true }: { email: string; enabled?: boolean; }): Promise<Partial<User>> {
    const user = await this.userPrismaRepository.findUserByEmail(email, enabled);
    return user;
  }


}
