import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Column } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {
  // parent type 이랑 child type이 다르면 InputType 기재 필요
  // or restaurant.entity에서 @InputType({isAbstract:true}) 데코레이터 추가
}
