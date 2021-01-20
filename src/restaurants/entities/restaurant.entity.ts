import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

// 레스토랑 클래스를 위한 object type을 만들어준다
@InputType({ isAbstract: true }) // 이 inputType이 스키마에 포함되지 않고 어디선가 복사해서 쓰겠다는 의미
@ObjectType() // Graphql을 위한
@Entity() // typeorm을 위한
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field(() => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field(() => Category)
  // 레스토랑과 카테고리는 1:N
  // 하나의 레스토랑은 하나의 카테고리를 갖는다
  @ManyToOne(() => Category, (category) => category.restaurants)
  category: Category;
}
