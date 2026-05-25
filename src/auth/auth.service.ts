import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private sanitizeUser(user: User): PublicUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(registerDto: RegisterUserDto): Promise<PublicUser> {
    const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.userRepository.create({
      ...registerDto,
      favorites: [],
      adoptionRequests: [],
    });

    const savedUser = await this.userRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async login(loginDto: LoginUserDto): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.sanitizeUser(user);
  }

  async getProfile(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['favorites', 'adoptionRequests'] });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.sanitizeUser(user);
  }
}
