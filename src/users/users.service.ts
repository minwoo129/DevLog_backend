import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getOne(id: number): Promise<UserEntity> {
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!result) throw new NotFoundException(`user data not found`);
    return result;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!result) return null;
    return result;
  }

  async createUser(userData: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (user)
      throw new HttpException('이미 등록된 계정입니다.', HttpStatus.FOUND);
    const hash = await bcrypt.hash(userData.password, 12);
    userData = { ...userData, password: hash };
    let isAdmin = false;
    if (userData.isAdmin && userData.adminConfirmPwd) {
      if (userData.adminConfirmPwd === process.env.ADMIN_CONFIRM_PWD) {
        isAdmin = true;
      }
    }
    const { name, email, password, nickname } = userData;
    const newUser = this.userRepository.create({
      name,
      email,
      password,
      nickname,
      isAdmin,
    });
    return await this.userRepository.save(newUser);
  }

  async remove(id: number) {
    try {
      await this.userRepository.delete(id);
      return true;
    } catch (e) {
      throw new HttpException('Internal server error', HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: number, userData: UpdateUserDTO) {
    try {
      await this.userRepository.update(id, userData);
      return await this.getOne(id);
    } catch (e) {
      throw new HttpException('Internal server error', HttpStatus.BAD_GATEWAY);
    }
  }
}
