import { Inject, Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { Logger } from 'winston';
import { CryptService } from "../../../utility/services/crypt.service";
import { CreateUserDto } from "../dto";
import { UserPrismaRepository } from "../repository/user.repository";

@Injectable()
export class UserCreateService {

    constructor(
        @Inject('winston')
        private readonly logger: Logger,
        private cslService: ClsService,
        private cryptService: CryptService,
        private userPrismaRepository: UserPrismaRepository,
    ) { }

    async createUser(user: CreateUserDto) {
        this.logger.info('Creating a user');
        user.password = await this.cryptService.encryptString(user.password);
        const createdUser = await this.userPrismaRepository.createUser(user);
        this.logger.info(`The user has been successfully created. UserId: ${JSON.stringify(createdUser.id)}`);
    }



}
