import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CryptService } from '../../utility/services/crypt.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'winston',
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: ClsService,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: CryptService,
          useValue: {
            info: jest.fn()
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
