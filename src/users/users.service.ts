import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['favorites', 'adoptionRequests'] });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async addFavorite(userId: string, animalId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });
    const animal = await this.animalRepository.findOne({ where: { id: animalId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    if (!user.favorites.some((favorite) => favorite.id === animal.id)) {
      user.favorites.push(animal);
      await this.userRepository.save(user);
    }

    return user;
  }

  async removeFavorite(userId: string, animalId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.favorites = user.favorites.filter((favorite) => favorite.id !== animalId);
    return this.userRepository.save(user);
  }

  async getFavorites(userId: string): Promise<Animal[]> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user.favorites;
  }
}
