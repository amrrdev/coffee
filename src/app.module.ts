import { Inject, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import databaseConfig from './config/database.config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: (databaseConfigration: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: databaseConfigration.host,
        port: databaseConfigration.port,
        username: databaseConfigration.username,
        password: databaseConfigration.password,
        database: databaseConfigration.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
      }),
      load: [databaseConfig],
    }),
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
