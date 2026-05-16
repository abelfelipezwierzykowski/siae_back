import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres_local',
      port: 5432,
      username: 'gb_one',
      password: '9375',
      database: 'siae',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    AnimalsModule,
    AdoptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

