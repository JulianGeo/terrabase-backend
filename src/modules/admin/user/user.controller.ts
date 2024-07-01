import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { UserCreateService } from './services/user-create.service';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
//@UseGuards(JwtAuthGuard)
//@UseInterceptors(UserIdInterceptor)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userCreateService: UserCreateService
  ) { }

  @Get('prisma')
  @ApiOperation({
    summary: 'Endpoint to get all users',
  })
  async getUsers() {
    const response = await this.userService.getAllUsers()
    return response;
  }

  @Post()
  @ApiOperation({
    summary: "Endpoint to create a user",
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const response = this.userCreateService.createUser(createUserDto);
    return response;
  }


}
