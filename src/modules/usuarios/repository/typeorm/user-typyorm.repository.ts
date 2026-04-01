import { Injectable } from '@nestjs/common';
import { Userrepository } from '../../interfaces/user-repository.interface';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../entities/user-model.entity';
import { Order } from '../../entities/order-model.entity';
import { CreateOrderDto } from '../../dto/order/create-order.dto';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

@Injectable()
export class UserRepository implements Userrepository {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) { }
  async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async () => {
      return await work();
    });
  }

  async createOrder(user: CreateOrderDto): Promise<CreateOrderDto> {
    return await this.orderRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByIdUser(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    return await this.userRepository.update({ id }, user).then(() => this.findByIdUser(id));
  }

  async findUserByEmailAndName({ name, email }: { name: string; email: string }): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('User')
      .where('User.name = :name', { name })
      .orWhere('User.email = :email', { email })
      .getMany();
  }
}
