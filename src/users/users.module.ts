import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // global 모듈인 ConfigService, JwtService의 경우 생략해줘야 한다
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
