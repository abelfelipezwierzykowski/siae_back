export class UpdateAdoptionRequestDto {
  status?: 'pending' | 'approved' | 'rejected';
  interviewDate?: string;
}
