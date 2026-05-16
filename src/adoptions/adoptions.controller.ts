import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  async create(@Body() createDto: CreateAdoptionRequestDto) {
    return this.adoptionsService.create(createDto);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.adoptionsService.findByUser(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateAdoptionRequestDto) {
    return this.adoptionsService.update(id, updateDto);
  }
}
