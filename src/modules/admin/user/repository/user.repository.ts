import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto';


@Injectable()
export class UserPrismaRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getAllUsers(): Promise<Partial<User>[]> {
        const users: Partial<User>[] = await this.prisma.user.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            }
        );
        return users;
    }

    async findUserByEmail(email: string, enabled: boolean = true): Promise<Partial<User>> {
        const user: Partial<User> = await this.prisma.user.findUnique(
            {
                where: {
                    email,
                    enabled
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    password: true,
                    enabled: true
                },
            }
        );
        return user;
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const newUser: User = await this.prisma.user.create({
            data: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                enabled: user.enabled,
                role: user.role
            }
        });
        return newUser;
    }

}