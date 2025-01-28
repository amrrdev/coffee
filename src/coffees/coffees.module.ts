import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavors.entity';
import { Event } from './events/entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';
import keyConfig from '../common/config/key.config';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeeConfig),
    ConfigModule.forFeature(keyConfig),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService, ApiKeyGuard],
  exports: [CoffeesService, ApiKeyGuard],
})
export class CoffeesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
