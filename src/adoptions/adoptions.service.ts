import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';
import { User } from '../auth/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly adoptionRepository: Repository<AdoptionRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(createDto: CreateAdoptionRequestDto): Promise<AdoptionRequest> {
    const user = await this.userRepository.findOne({ where: { id: createDto.userId } });
    const animal = await this.animalRepository.findOne({ where: { id: createDto.animalId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    const request = this.adoptionRepository.create({
      user,
      animal,
      animalName: animal.name,
      animalPhoto: animal.photos[0] ?? '',
      status: 'pending',
      motivation: createDto.motivation,
      hasExperience: createDto.hasExperience,
      housingType: createDto.housingType,
      hasYard: createDto.hasYard,
      otherPets: createDto.otherPets,
    });

    return this.adoptionRepository.save(request);
  }

  async findByUser(userId: string): Promise<AdoptionRequest[]> {
    return this.adoptionRepository.find({
      where: { user: { id: userId } },
      relations: ['animal'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateAdoptionRequestDto): Promise<AdoptionRequest> {
    const request = await this.adoptionRepository.findOne({ where: { id }, relations: ['animal', 'user'] });
    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    Object.assign(request, updateDto);
    return this.adoptionRepository.save(request);
  }
}
