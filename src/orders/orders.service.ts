import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async crateOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurants.findOne(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }

    for (const item of items) {
      const dish = await this.dishes.findOne(item.dishId);
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      console.log(`Dish price: ${dish.price}`);
      // 주문 생성에 넣은 각 옵션들 배회하며 금액 계산
      for (const itemOption of item.options) {
        /**
         * 메뉴 옵션에서 db에 있는 옵션명 = 주문 생성에 입력된 옵션명이 같은 메뉴 옵션 찾기
         */
        const dishOption = dish.options.find(
          (dishOption) => dishOption.name === itemOption.name,
        );
        if (dishOption) {
          // 찾은 메뉴 옵션에 extra 프로퍼티 값 얻기
          if (dishOption.extra) {
            console.log(`$USD + ${dishOption.extra}`);
          } else {
            /**
             * 메뉴 옵션의 초이스들에서 초이스의 이름 = 주문 생성에 입력된 초이스가 같은 메뉴 옵션 초이스 찾기
             */
            const dishOptionChoice = dishOption.choices.find(
              (optionChoice) => optionChoice.name === itemOption.choice,
            );
            // 찾은 메뉴 옵션의 초이스에 extra 프로퍼티 값 얻기
            if (dishOptionChoice) {
              if (dishOptionChoice.extra) {
                console.log(`$USD + ${dishOptionChoice.extra}`);
              }
            }
          }
        }
      }
      /*await this.orderItems.save(
        this.orderItems.create({
          dish,
          options: item.options,
        }),
      ); */
    }
    /* const order = await this.orders.save(
      this.orders.create({
        customer,
        restaurant,
      }),
    );
    console.log(order); */
  }
}
