import { Module } from '@nestjs/common';
import { CondicoesService } from './condicoes.service';
import { CondicoesController } from './condicoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Condicoes } from './entities/condicoe.entity';

@Module({
  controllers: [CondicoesController],
  providers: [CondicoesService],
  imports: [TypeOrmModule.forFeature([Condicoes]) ],
})
export class CondicoesModule {}
