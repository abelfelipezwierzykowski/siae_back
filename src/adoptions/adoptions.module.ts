import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionsController } from './adoptions.controller';
import { AdoptionsService } from './adoptions.service';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { User } from '../auth/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionRequest, User, Animal])],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
  exports: [AdoptionsService],
})
export class AdoptionsModule {}
