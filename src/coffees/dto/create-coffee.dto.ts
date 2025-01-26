import { IsNumber, IsString } from 'class-validator';
import { Flavor } from '../entities/flavors.entity';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: string[];
}
