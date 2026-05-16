import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { AdoptionRequest } from '../../adoptions/entities/adoption-request.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['dog', 'cat'] })
  species: 'dog' | 'cat';

  @Column('int')
  age: number;

  @Column({ type: 'enum', enum: ['small', 'medium', 'large'] })
  size: 'small' | 'medium' | 'large';

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column({ type: 'enum', enum: ['available', 'adopted'], default: 'available' })
  status: 'available' | 'adopted';

  @Column('text')
  description: string;

  @Column('text', { array: true, default: [] })
  photos: string[];

  @Column('text')
  location: string;

  @Column('text', { array: true, default: [] })
  characteristics: string[];

  @Column('boolean', { default: false })
  vaccinated: boolean;

  @Column('boolean', { default: false })
  neutered: boolean;

  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @OneToMany(() => AdoptionRequest, (request) => request.animal)
  adoptionRequests: AdoptionRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
