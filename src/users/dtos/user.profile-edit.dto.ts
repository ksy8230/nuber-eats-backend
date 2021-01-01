import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOut extends CoreOutput {}

// user에서 email, password 가지고 class를 만들고 PartialType을 이용해서 optional하게 만들기
@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
