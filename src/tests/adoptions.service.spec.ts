import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { AdoptionsService } from '../adoptions/adoptions.service';
import { AdoptionRequest } from '../adoptions/entities/adoption-request.entity';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../auth/entities/user.entity';
import { CreateAdoptionRequestDto } from '../adoptions/dto/create-adoption-request.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('AdoptionsService', () => {
  let service: AdoptionsService;
  let adoptionRepository: MockRepository<AdoptionRequest>;
  let userRepository: MockRepository<User>;
  let animalRepository: MockRepository<Animal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptionsService,
        { provide: getRepositoryToken(AdoptionRequest), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Animal), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<AdoptionsService>(AdoptionsService);
    adoptionRepository = module.get<MockRepository<AdoptionRequest>>(getRepositoryToken(AdoptionRequest));
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    animalRepository = module.get<MockRepository<Animal>>(getRepositoryToken(Animal));
  });

  describe('create', () => {
    it('should register an adoption request when the animal is available', async () => {
      const user: User = {
        id: 'user-1',
        name: 'João',
        email: 'joao@example.com',
        password: 'secret',
        phone: '111111111',
        address: 'Rua A, 123',
        favorites: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const animal: Animal = {
        id: 'animal-1',
        name: 'Rex',
        species: 'dog',
        age: 4,
        size: 'large',
        gender: 'male',
        status: 'available',
        description: 'Cachorro amigável',
        photos: ['https://example.com/rex.jpg'],
        location: 'São Paulo',
        characteristics: ['Brincalhão'],
        vaccinated: true,
        neutered: true,
        favoritedBy: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Animal;
      const dto: CreateAdoptionRequestDto = {
        userId: user.id,
        animalId: animal.id,
        motivation: 'Quero um companheiro',
        hasExperience: true,
        housingType: 'house',
        hasYard: true,
        otherPets: false,
      };
      const adoptionRequest: AdoptionRequest = {
        id: 'request-1',
        user,
        animal,
        animalName: animal.name,
        animalPhoto: animal.photos[0],
        status: 'pending',
        motivation: dto.motivation,
        hasExperience: dto.hasExperience,
        housingType: dto.housingType,
        hasYard: dto.hasYard,
        otherPets: dto.otherPets,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AdoptionRequest;

      userRepository.findOne!.mockResolvedValueOnce(user);
      animalRepository.findOne!.mockResolvedValueOnce(animal);
      adoptionRepository.create!.mockReturnValue(adoptionRequest);
      adoptionRepository.save!.mockResolvedValue(adoptionRequest);

      const result = await service.create(dto);

      expect(result).toEqual(adoptionRequest);
      expect(adoptionRepository.create).toHaveBeenCalledWith({
        user,
        animal,
        animalName: animal.name,
        animalPhoto: animal.photos[0],
        status: 'pending',
        motivation: dto.motivation,
        hasExperience: dto.hasExperience,
        housingType: dto.housingType,
        hasYard: dto.hasYard,
        otherPets: dto.otherPets,
      });
    });

    it('should throw BadRequestException when animal is already adopted', async () => {
      const user: User = {
        id: 'user-2',
        name: 'Maria',
        email: 'maria@example.com',
        password: 'secret',
        phone: '222222222',
        address: 'Av. B, 456',
        favorites: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const animal: Animal = {
        id: 'animal-2',
        name: 'Bella',
        species: 'cat',
        age: 2,
        size: 'small',
        gender: 'female',
        status: 'adopted',
        description: 'Gata tranquila',
        photos: ['https://example.com/bella.jpg'],
        location: 'Rio de Janeiro',
        characteristics: ['Calma'],
        vaccinated: true,
        neutered: true,
        favoritedBy: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Animal;
      const dto: CreateAdoptionRequestDto = {
        userId: user.id,
        animalId: animal.id,
        motivation: 'Quero adotar',
        hasExperience: false,
        housingType: 'apartment',
        hasYard: false,
        otherPets: true,
      };

      userRepository.findOne!.mockResolvedValueOnce(user);
      animalRepository.findOne!.mockResolvedValueOnce(animal);

      await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
