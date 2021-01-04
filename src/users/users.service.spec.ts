import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UserService', () => {
  it.todo('createAccount');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    const service: UsersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
