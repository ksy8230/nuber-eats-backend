import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRestaurantDto {
    @Field(() => String) 
    name: string;

    @Field(() => Boolean) 
    isVegan: boolean;

    @Field(() => String) 
    address: string;
    
    @Field(() => String) 
    ownerName: string;
}