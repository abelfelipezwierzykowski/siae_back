import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const animal = this.animalRepository.create({
      ...createAnimalDto,
      status: 'available',
    });
    return this.animalRepository.save(animal);
  }

  findAll(): Promise<Animal[]> {
    return this.animalRepository.find({ relations: ['favoritedBy'] });
  }

  async findOne(id: string): Promise<Animal> {
    const animal = await this.animalRepository.findOne({ where: { id }, relations: ['favoritedBy'] });
    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }
    return animal;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);
    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }
    Object.assign(animal, updateAnimalDto);
    return this.animalRepository.save(animal);
  }

  async remove(id: string): Promise<void> {
    const result = await this.animalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Animal não encontrado');
    }
  }
}
