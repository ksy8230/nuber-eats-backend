import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

// 레스토랑 클래스를 위한 object type을 만들어준다
@InputType({isAbstract:true}) // 이 inputType이 스키마에 포함되지 않고 어디선가 복사해서 쓰겠다는 의미
@ObjectType() // Graphql을 위한
@Entity() // typeorm을 위한
export class Restaurant {
    // 그래프큐엘에서 본 레스토랑이 어떻게 생겼나 설명
    @PrimaryColumn()
    @Field(() => Number)
    id : number;

    @Field(() => String)
    @Column()
    name : string;

    @Field(() => Boolean, {nullable:true}) // 필수값이 아니다
    @Column()
    isVegan?: boolean

    @Field(() => String)
    @Column()
    address: string

    @Field(() => String)
    @Column()
    ownerName: string

    @Field(() => String)
    @Column()
    categoryName: string
}
