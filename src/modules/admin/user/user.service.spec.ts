import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { UserPrismaRepository } from './repository/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserPrismaRepository = {
    getAllUsers: jest.fn(),
    findUserByEmail: jest.fn(),
  };

  mockUserPrismaRepository.findUserByEmail.mockImplementation((email, enabled = true) => {
    if (email === 'test@example.com' && enabled) {
      return Promise.resolve({ id: 1, email });
    } else if (email === 'disabled@user.com' && !enabled) {
      return Promise.resolve({ id: 2, email, enabled });
    } else {
      return Promise.resolve(null);
    }
  });

  mockUserPrismaRepository.getAllUsers.mockResolvedValueOnce([
    { id: 1, email: 'test@example.com' },
    { id: 2, email: 'another@test.com' },
  ]);


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
          provide: UserPrismaRepository,
          useValue: {
            info: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
