import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Verification } from 'src/users/entities/verification.entity';
import { CoreOutput } from './output.dto';

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}
