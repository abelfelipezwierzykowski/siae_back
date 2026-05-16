import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.userRepository.create({
      ...registerDto,
      favorites: [],
      adoptionRequests: [],
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['favorites', 'adoptionRequests'] });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
}
