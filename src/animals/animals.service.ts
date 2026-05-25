import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (
      !createAnimalDto.name ||
      !createAnimalDto.species ||
      createAnimalDto.age === undefined ||
      !createAnimalDto.size ||
      !createAnimalDto.gender ||
      !createAnimalDto.description ||
      !createAnimalDto.location ||
      !Array.isArray(createAnimalDto.photos) ||
      createAnimalDto.photos.length === 0 ||
      !Array.isArray(createAnimalDto.characteristics) ||
      createAnimalDto.characteristics.length === 0 ||
      createAnimalDto.vaccinated === undefined ||
      createAnimalDto.neutered === undefined
    ) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }

    const animal = this.animalRepository.create({
      ...createAnimalDto,
      status: 'available',
    });
    return this.animalRepository.save(animal);
  }

  findAll(): Promise<Animal[]> {
    return this.animalRepository.find({ relations: ['favoritedBy'] });
  }

  async search(filters: {
    name?: string;
    species?: 'dog' | 'cat';
    size?: 'small' | 'medium' | 'large';
    age?: 'young' | 'adult' | 'senior';
  }): Promise<Animal[]> {
    const animals = await this.findAll();
    return animals.filter((animal) => {
      if (filters.name && !animal.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.species && animal.species !== filters.species) {
        return false;
      }
      if (filters.size && animal.size !== filters.size) {
        return false;
      }
      if (filters.age) {
        if (filters.age === 'young' && animal.age > 2) return false;
        if (filters.age === 'adult' && (animal.age <= 2 || animal.age > 7)) return false;
        if (filters.age === 'senior' && animal.age <= 7) return false;
      }
      return true;
    });
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
