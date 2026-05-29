import { IsString, IsEmail, MinLength, IsDefined } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsDefined({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsDefined({ message: 'Senha é obrigatória' })
  password: string;
}
