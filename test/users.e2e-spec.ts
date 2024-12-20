import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '@/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@/entities';
import { DataSource } from 'typeorm';

describe('Users E2E Testing', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            console.log(
              "🚀 ~ beforeAll ~ configService.get('DB_HOST'):",
              configService.get('DB_HOST'),
            );
            return {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: 5432,
              username: 'postgres',
              password: '12345678',
              database: 'unit_testing',
              entities: [User],
              synchronize: true,
            };
          },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    dataSource = module.get<DataSource>(DataSource);

    await app.init();
  }, 50000);

  beforeEach(async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.clear();
  });

  describe('POST /users', () => {
    it('should create a user successfully', () => {
      const payload = {
        email: 'a@gmail.com',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201)
        .expect(payload.email);
    });

    it('should throw error when email is not provided', () => {
      const payload = {
        email: '',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400);
    });

    it('should throw error when password is not provided', () => {
      const payload = {
        email: '',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
