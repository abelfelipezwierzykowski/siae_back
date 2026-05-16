export class CreateAdoptionRequestDto {
  userId: string;
  animalId: string;
  motivation: string;
  hasExperience: boolean;
  housingType: 'house' | 'apartment';
  hasYard: boolean;
  otherPets: boolean;
}
