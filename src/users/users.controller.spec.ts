import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as request from 'supertest';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn((x) => x),
            update: jest.fn(),
          },
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      // Arrange
      const user = { email: 'a@gmail.com', password: '123' };
      jest.spyOn(controller, 'create').mockResolvedValueOnce(user.email);

      // Act
      const res = await controller.create(user);

      // Assert
      expect(res).toEqual(user.email);
    });
  });
});
