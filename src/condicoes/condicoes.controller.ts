import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondicoesService } from './condicoes.service';
import { CreateCondicoeDto } from './dto/create-condicoe.dto';
import { UpdateCondicoeDto } from './dto/update-condicoe.dto';

@Controller('condicoes')
export class CondicoesController {
  constructor(
    private readonly condicoesService: CondicoesService,
   
  ) {}

  @Post()
  create(@Body() createCondicoeDto: CreateCondicoeDto) {
    return this.condicoesService.create(createCondicoeDto);
  }

  @Get()
  findAll() {
    return this.condicoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.condicoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCondicoeDto: UpdateCondicoeDto) {
    return this.condicoesService.update(+id, updateCondicoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.condicoesService.remove(+id);
  }
}
