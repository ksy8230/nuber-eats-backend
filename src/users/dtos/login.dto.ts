import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class LogInOutput extends MutationOutput {
  @Field(() => String)
  token: string;
}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}
