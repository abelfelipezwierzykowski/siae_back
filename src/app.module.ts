import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondicoesModule } from './condicoes/condicoes.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CondicoesModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '9375',
      database: 'siae',
      autoLoadEntities: true,
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

