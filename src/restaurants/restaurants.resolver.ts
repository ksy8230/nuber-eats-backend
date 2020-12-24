import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity'
@Resolver(() => Restaurant)
export class RestaurantResolver {
    @Query(() => [Restaurant])
    restaurants(@Args('veganOnly') veganOnly: boolean) : Restaurant[] {
        return [];
    }
    @Mutation(() => Boolean)
    createRestaurant(
        // @Args('name') name: string,
        // @Args('isVegan') isVegan: boolean,
        // @Args('address') address: string,
        // @Args('ownerName') ownerName: string
        @Args('createRestaurantInput') createRestaurantInput : CreateRestaurantDto
    ): boolean {
        console.log(createRestaurantInput)
        return true;
    }


}