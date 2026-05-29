import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private sanitizeUser(user: User): PublicUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(registerDto: RegisterUserDto): Promise<PublicUser> {
    this.logger.log(`Tentativa de cadastro para email: ${registerDto.email}`);
    
    // Validação básica
    if (!registerDto.email || !registerDto.password || !registerDto.name || !registerDto.phone || !registerDto.address) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email: registerDto.email.toLowerCase() } 
    });
    
    if (existingUser) {
      this.logger.warn(`Tentativa de cadastro com email já existente: ${registerDto.email}`);
      throw new ConflictException('Este email já está cadastrado');
    }

    // Validar comprimento da senha
    if (registerDto.password.length < 8) {
      throw new BadRequestException('A senha deve ter no mínimo 8 caracteres');
    }

    try {
      // Hash da senha com bcrypt (salt rounds: 10)
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.userRepository.create({
        name: registerDto.name.trim(),
        email: registerDto.email.toLowerCase(),
        password: hashedPassword,
        phone: registerDto.phone,
        address: registerDto.address,
        favorites: [],
        adoptionRequests: [],
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`Novo usuário cadastrado: ${savedUser.id}`);
      return this.sanitizeUser(savedUser);
    } catch (error) {
      this.logger.error(`Erro ao cadastrar usuário: ${error.message}`, error.stack);
      throw new BadRequestException('Erro ao realizar cadastro. Tente novamente.');
    }
  }

  async login(loginDto: LoginUserDto): Promise<PublicUser> {
    this.logger.log(`Tentativa de login para email: ${loginDto.email}`);
    
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const user = await this.userRepository.findOne({ 
      where: { email: loginDto.email.toLowerCase() } 
    });
    
    if (!user) {
      this.logger.warn(`Login falhou - usuário não encontrado: ${loginDto.email}`);
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    try {
      const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!passwordMatch) {
        this.logger.warn(`Login falhou - senha incorreta para: ${loginDto.email}`);
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      this.logger.log(`Login bem-sucedido para usuário: ${user.id}`);
      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Erro ao fazer login: ${error.message}`, error.stack);
      throw new BadRequestException('Erro ao realizar login. Tente novamente.');
    }
  }

  async getProfile(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: ['favorites', 'adoptionRequests'] 
    });
    
    if (!user) {
      this.logger.warn(`Perfil não encontrado para ID: ${id}`);
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return this.sanitizeUser(user);
  }
}
