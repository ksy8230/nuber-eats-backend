import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigService, JwtService],
  // global 모듈인 ConfigService, JwtService의 경우 생략해줘도 되는데 학습 이해를 위해서 남겨둔다
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
