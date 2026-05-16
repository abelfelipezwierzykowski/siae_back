import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Animal } from '../../animals/entities/animal.entity';

@Entity()
export class AdoptionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.adoptionRequests, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Animal, (animal) => animal.adoptionRequests, { eager: true, nullable: false })
  animal: Animal;

  @Column()
  animalName: string;

  @Column('text')
  animalPhoto: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column('text')
  motivation: string;

  @Column({ type: 'boolean', default: false })
  hasExperience: boolean;

  @Column({ type: 'enum', enum: ['house', 'apartment'] })
  housingType: 'house' | 'apartment';

  @Column({ type: 'boolean', default: false })
  hasYard: boolean;

  @Column({ type: 'boolean', default: false })
  otherPets: boolean;

  @Column({ type: 'timestamp', nullable: true })
  interviewDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
