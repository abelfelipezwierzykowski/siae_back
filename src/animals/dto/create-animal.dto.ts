export class CreateAnimalDto {
  name: string;
  species: 'dog' | 'cat';
  age: number;
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  description: string;
  location: string;
  photos: string[];
  characteristics: string[];
  vaccinated: boolean;
  neutered: boolean;
}
