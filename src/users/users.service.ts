import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LogInOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
// import { ConfigService } from '@nestjs/config';
import { EditProfileInput, EditProfileOut } from './dtos/user.profile-edit.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user.profile.dto';
import { VerifyEmailOutput } from 'src/common/dtos/verify-email.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // private readonly config: ConfigService,
    private readonly JwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      console.log(exists);
      if (exists) {
        return { ok: false, error: '사용자가 이미 존재합니다.' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({ user: user }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LogInOutput> {
    // find the user with the email
    // check if the pw is correct
    // make a JWT ans give it to the user
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] }, // password 컬럼이 select: false로 되어 있기 때문에 따로 넣어줘야 유저 정보에 password가 담긴다
      );
      if (!user) {
        return {
          ok: false,
          error: '유저를 찾을 수 없습니다.',
        };
      }
      const passwordCorrect = await user.checkPassword(password); // entity에서 작성한 함수
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        };
      }
      const token = this.JwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: '로그인을 할 수 없습니다',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (user) {
        return {
          ok: true,
          user: user,
        };
      }
      throw Error();
    } catch (error) {
      return {
        ok: false,
        error: '유저를 찾을 수 없습니다.',
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOut> {
    // password는 수정하고 싶지 않거나 email은 수정하고 싶지 않을 때
    // 구조분해방식 ({password, email}) 으로 넘기지 말고 EditProfileInput 같이 수정 후
    // 받은 것들만 {...EditProfileInput} 객체에 넣도록 수정
    // 근데 여기 코드에서는 update 메서드가 엔티티를 업데이트하지 않아서 password가 해싱되지 않는 에러가 떴다

    try {
      const user = await this.users.findOne(userId);
      console.log('editProfile findOne 1', user);
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user: user }),
        );
        console.log(verification);
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      // update 메서드는 쿼리를 db에 보낼 뿐 entity를 업데이트하지 않는다
      // save 메서드로 수정하고 js로 직접 업데이트 수정
      console.log('editProfile findOne 2', user);
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '업데이트를 할 수 없습니다.',
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return {
          ok: true,
        };
      }
      return { ok: false, error: '인증을 찾을 수 없습니다.' };
    } catch (error) {
      return {
        ok: false,
        error: '이메일 인증을 할 수 없습니다',
      };
    }
  }
}
