import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { Column } from "typeorm";
@ArgsType()
export class CreateRestaurantDto {
    @Field(() => String)
    @IsString()
    @Length(5, 10)
    name: string;

    @Field(() => Boolean) 
    @IsBoolean()
    isVegan: boolean;

    @Field(() => String) 
    @IsString()
    address: string;

    @Field(() => String) 
    @IsString()
    ownerName: string;

    @Field(() => String)
    @Column()
    categoryName: string
}