import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity'
import { RestaurantService } from './restaurants.service';
@Resolver(() => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }
    @Mutation(() => Boolean)
    async createRestaurant(
        // @Args('name') name: string,
        // @Args('isVegan') isVegan: boolean,
        // @Args('address') address: string,
        // @Args('ownerName') ownerName: string
        @Args() createRestaurantDto : CreateRestaurantDto
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}