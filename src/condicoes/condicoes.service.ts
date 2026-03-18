import { Injectable } from '@nestjs/common';
import { CreateCondicoeDto } from './dto/create-condicoe.dto';
import { UpdateCondicoeDto } from './dto/update-condicoe.dto';
import { Condicoes } from './entities/condicoe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CondicoesController } from './condicoes.controller';

@Injectable()
export class CondicoesService {

 constructor(
    @InjectRepository(Condicoes)
    private condicoesRepository: Repository<Condicoes>,
  ) {}

  async create(createCondicoeDto: CreateCondicoeDto) {
    try {
      const novaCondicao = this.condicoesRepository.create(createCondicoeDto);
      await this.condicoesRepository.save(novaCondicao);
      return novaCondicao;
    } catch (error) {
      console.error('Error creating condicao:', error);
      throw new Error('Failed to create condicao');
    }
  }

 async findAll() {
    try{
const todascondicoes = await this.condicoesRepository.find();
return todascondicoes;   


  }catch (error) {
    console.error('Error fetching condicoes:', error);
    throw new Error('Failed to fetch condicoes');
  }
  }


  findOne(id: number) {
    try{
      return this.condicoesRepository.findOneBy({ id });
    } catch (error) {
      console.error('Error fetching condicao:', error);
      throw new Error('Failed to fetch condicao');
    }
  }

  async update(id: number, updateCondicoeDto: UpdateCondicoeDto) {
    try {
      const condicao = await this.findOne(id);

       return condicao? Object.assign(condicao, updateCondicoeDto):
      this.condicoesRepository.save(condicao!);
    } catch (error) {
      console.error('Error updating condicao:', error);
      throw new Error('Failed to update condicao');
    }
  }

  async remove(id: number) {
    try {
      const condicao = await this.findOne(id);
      if(condicao){
      return this.condicoesRepository.remove(condicao).then(() => {
      return { message: 'Condicao removed successfully', id }});
      }else{
        throw new Error('Condicao not found');
      }
    } catch (error) {
      console.error('Error removing condicao:', error);
      throw new Error('Failed to remove condicao');
    }
  }
}
