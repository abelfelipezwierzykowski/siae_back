import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { AnimalsService } from '../animals/animals.service';
import { Animal } from '../animals/entities/animal.entity';
import { CreateAnimalDto } from '../animals/dto/create-animal.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('AnimalsService', () => {
  let service: AnimalsService;
  let repository: MockRepository<Animal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getRepositoryToken(Animal),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
    repository = module.get<MockRepository<Animal>>(getRepositoryToken(Animal));
  });

  describe('create', () => {
    it('should create an animal when all required fields are provided', async () => {
      const dto: CreateAnimalDto = {
        name: 'Rex',
        species: 'dog',
        age: 3,
        size: 'large',
        gender: 'male',
        description: 'Um cachorro muito amigável',
        location: 'São Paulo, SP',
        photos: ['https://example.com/rex.jpg'],
        characteristics: ['Brincalhão'],
        vaccinated: true,
        neutered: false,
      };

      const createdAnimal: Animal = {
        id: 'test-id',
        ...dto,
        status: 'available',
        favoritedBy: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Animal;

      repository.create!.mockReturnValue(createdAnimal);
      repository.save!.mockResolvedValue(createdAnimal);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        status: 'available',
      });
      expect(repository.save).toHaveBeenCalledWith(createdAnimal);
      expect(result).toEqual(createdAnimal);
    });

    it('should throw BadRequestException when required fields are missing', async () => {
      const dto = {
        name: 'Rex',
        species: 'dog',
      } as unknown as CreateAnimalDto;

      await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('search', () => {
    const animalList: Animal[] = [
      {
        id: '1',
        name: 'Rex',
        species: 'dog',
        age: 3,
        size: 'large',
        gender: 'male',
        status: 'available',
        description: 'Cachorro brincalhão',
        photos: ['https://example.com/rex.jpg'],
        location: 'São Paulo, SP',
        characteristics: ['Brincalhão'],
        vaccinated: true,
        neutered: false,
        favoritedBy: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Mia',
        species: 'cat',
        age: 1,
        size: 'small',
        gender: 'female',
        status: 'available',
        description: 'Gatinha calma',
        photos: ['https://example.com/mia.jpg'],
        location: 'Rio de Janeiro, RJ',
        characteristics: ['Calma'],
        vaccinated: true,
        neutered: true,
        favoritedBy: [],
        adoptionRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return matching animals when name filter matches existing animals', async () => {
      repository.find!.mockResolvedValue(animalList);

      const result = await service.search({ name: 'Rex' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Rex');
    });

    it('should return empty array when no animals match the provided filters', async () => {
      repository.find!.mockResolvedValue(animalList);

      const result = await service.search({ species: 'dog', size: 'small', age: 'senior' });

      expect(result).toEqual([]);
    });
  });
});
