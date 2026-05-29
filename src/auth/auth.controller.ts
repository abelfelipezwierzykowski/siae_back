import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    if (!registerDto.name || !registerDto.email || !registerDto.password || !registerDto.phone || !registerDto.address) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }
    const user = await this.authService.register(registerDto);
    return { success: true, user, message: 'Cadastro realizado com sucesso!' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }
    const user = await this.authService.login(loginDto);
    return { success: true, user, message: 'Login realizado com sucesso!' };
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}
