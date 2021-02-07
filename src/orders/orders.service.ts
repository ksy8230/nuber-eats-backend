import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrdersInput } from './dtos/get-orders.dto';
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

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found.',
          };
        }
        let dishFinalPrice = dish.price;

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
              dishFinalPrice = dishFinalPrice + dishOption.extra;
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
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        console.log('orderFinalPrice', orderFinalPrice);

        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      console.log('order ===========', order);
      return {
        ok: true,
        error: null,
      };
    } catch {
      return {
        ok: false,
        error: '주문 생성 할 수 없습니다',
      };
    }
  }

  async getOrders(user: User, getOrdersInput: GetOrdersInput) {
    try {
      let orders: Order[];
      // 유저가 고객인 주문들
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
          },
        });
        // 유저가 배달부인 주문들
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: user,
          },
        });
        // 유저가 레스토랑 주인인 주문들
      } else if (user.role === UserRole.Owner) {
        const restaurant = this.restaurants.find({
          where: {
            owner: user,
          },
          relations: ['orders'],
        });
        orders = (await restaurant).map((r) => r.orders).flat(1);
      }
      console.log(orders);
      return {
        ok: true,
        error: null,
        orders: orders,
      };
    } catch {
      return {
        ok: false,
        error: '주문들을 가져올 수 없습니다.',
      };
    }
  }
}
