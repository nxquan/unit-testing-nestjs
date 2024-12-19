import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((x) => x as User),
            save: jest.fn((x) => x as User),
            exists: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const user = {
        email: 'email1@gmail.com',
        password: '123',
      };

      jest.spyOn(usersRepository, 'exists').mockResolvedValue(false);

      // Act
      const result = await service.create(user);

      // Assert
      expect(result).toBe(user?.email);
    });

    it('should throw an error when email is not provided', async () => {
      const user = {
        email: 'email1@gmail.com',
        password: '',
      };

      const result = service.create(user);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw an error when email is already used', () => {
      const user = {
        email: 'email1@gmail.com',
        password: '123',
      };

      jest.spyOn(usersRepository, 'exists').mockResolvedValue(true);

      expect(service.create(user)).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
