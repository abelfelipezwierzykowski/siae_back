import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  async create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  async findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.animalsService.remove(id);
    return { message: 'Animal removido com sucesso' };
  }
}
