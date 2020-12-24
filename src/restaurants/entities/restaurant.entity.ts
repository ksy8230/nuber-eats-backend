import { Field, ObjectType } from "@nestjs/graphql";

// 레스토랑 클래스를 위한 object type을 만들어준다
@ObjectType()
export class Restaurant {
    // 그래프큐엘에서 본 레스토랑이 어떻게 생겼나 설명
    @Field(() => String)
    name : string;

    @Field(() => Boolean, {nullable:true}) // 필수값이 아니다
    isVegan?: boolean

    @Field(() => String)
    address: string

    @Field(() => String)
    ownerName: string
}
