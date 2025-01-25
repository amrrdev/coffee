import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoffeesService {
  private coffees = [
    {
      id: 1,
      name: 'turky',
      brand: 'egypt',
      flavors: ['chocolate'],
    },
  ];

  constructor(@InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>) {}

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const res = this.coffees.find((coffee) => coffee.id === Number(id));
    if (!res) {
      throw new HttpException('eororro', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === Number(id));
    if (coffeeIndex >= 0) this.coffees.splice(coffeeIndex, 1);
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    // this.coffees.push(createCoffeeDto);
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id);
    if (!!existingCoffee) {
      // TODO: handle this
    }
    // TODO: update this
  }
}
