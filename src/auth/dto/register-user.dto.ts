import { IsString, IsEmail, MinLength, MaxLength, IsPhoneNumber, IsDefined } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @IsDefined({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsDefined({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(50, { message: 'Senha deve ter no máximo 50 caracteres' })
  @IsDefined({ message: 'Senha é obrigatória' })
  password: string;

  @IsString({ message: 'Telefone deve ser uma string' })
  @MinLength(10, { message: 'Telefone deve ter no mínimo 10 caracteres' })
  @MaxLength(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
  @IsDefined({ message: 'Telefone é obrigatório' })
  phone: string;

  @IsString({ message: 'Endereço deve ser uma string' })
  @MinLength(5, { message: 'Endereço deve ter no mínimo 5 caracteres' })
  @MaxLength(200, { message: 'Endereço deve ter no máximo 200 caracteres' })
  @IsDefined({ message: 'Endereço é obrigatório' })
  address: string;
}
