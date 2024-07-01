import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CryptService } from '../../utility/services/crypt.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLogin } from './interface/Login.interface';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private readonly cryptService: CryptService
    ) { }


    async getValidUser(login: LoginDto): Promise<Partial<User>> {
        const user: Partial<User> = await this.userService.getUser({ email: login.email });
        if (!user || !this.cryptService.validateString(login.password, user.password)) {
            throw new UnauthorizedException('Bad credentials');
        }
        return user;
    }


    async login(login: LoginDto): Promise<ResponseLogin> {
        const user: Partial<User> = await this.getValidUser(login);
        const response = await this.generateLoginResponse(user);
        return response;
    }

    async generateLoginResponse(user: Partial<User>): Promise<ResponseLogin> {
        const token = await this.generateLoginToken(user.id);

        return {
            token,
            name: user.name,
            lastName: user.lastName
        };
    }


    async generateLoginToken(id: number): Promise<string> {
        const payload = { id };
        const token = this.jwtService.sign(payload);
        return token;
    }

}
