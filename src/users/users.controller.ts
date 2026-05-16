import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/favorites')
  async getFavorites(@Param('id') id: string) {
    return this.usersService.getFavorites(id);
  }

  @Post(':id/favorites/:animalId')
  async addFavorite(@Param('id') id: string, @Param('animalId') animalId: string) {
    return this.usersService.addFavorite(id, animalId);
  }

  @Delete(':id/favorites/:animalId')
  async removeFavorite(@Param('id') id: string, @Param('animalId') animalId: string) {
    return this.usersService.removeFavorite(id, animalId);
  }
}
