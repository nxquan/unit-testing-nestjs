import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    console.log('🚀 ~ UsersService ~ create ~ dto:', dto);
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const isEmailUsed = await this.usersRepository.exists({
      where: {
        email,
      },
    });
    console.log('🚀 ~ UsersService ~ create ~ isEmailUsed:', isEmailUsed);

    if (isEmailUsed) {
      throw new BadRequestException('Email is already used');
    }

    const user = await this.usersRepository.save({
      email,
      password,
    });

    return user.email;
  }

  async update(id: number, dto: UpdateUserDto) {
    const { name } = dto;

    if (!name) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersRepository.update(id, {
      name,
    });

    return user.affected;
  }
}
