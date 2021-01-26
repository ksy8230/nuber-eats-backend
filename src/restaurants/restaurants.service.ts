import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 생성할 수 없습니다.',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        editRestaurantInput.restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: '레스토랑을 찾을 수 없습니다',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '소유하지 않은 레스토랑을 수정할 수 없습니다',
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId, // id를 보내지 않으면 새로운 레스토랑을 생성
          ...editRestaurantInput,
          ...(category && { category: category }),
        },
      ]);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 수정할 수 없습니다',
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    restaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        restaurantInput.restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: '레스토랑을 찾을 수 없습니다',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '소유하지 않은 레스토랑을 삭제할 수 없습니다',
        };
      }
      await this.restaurants.delete(restaurantInput.restaurantId);
    } catch {
      return {
        ok: false,
        error: '레스토랑을 삭제할 수 없습니다',
      };
    }
  }
}
