import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavors.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from './events/entities/event.entity';
import { ConfigType } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(coffeeConfig.KEY)
    private readonly coffeesConfigration: ConfigType<typeof coffeeConfig>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const res = await this.coffeeRepository.findOne({ where: { id }, relations: ['flavors'] });
    if (!res) {
      throw new NotFoundException(`There's no coffee with that id #${id}`);
    }
    return res;
  }

  async remove(id: number): Promise<void> {
    const result = await this.coffeeRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`There's no coffee with that id #${id}`);
    }
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({ ...createCoffeeDto, flavors });
    return await this.coffeeRepository.save(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))));

    const coffee = await this.coffeeRepository.preload({ id, ...updateCoffeeDto, flavors });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return await this.coffeeRepository.save(coffee);
  }

  async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
