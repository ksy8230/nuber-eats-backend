import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class LogInOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}
