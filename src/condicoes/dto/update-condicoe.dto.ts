import { PartialType } from '@nestjs/mapped-types';
import { CreateCondicoeDto } from './create-condicoe.dto';

export class UpdateCondicoeDto extends PartialType(CreateCondicoeDto) {}
