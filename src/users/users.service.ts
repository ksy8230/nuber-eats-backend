import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return '사용자가 이미 존재합니다.';
      }
      // TODO : create user & hash the password
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return '계정을 생성할 수 없습니다.';
    }
  }
}
