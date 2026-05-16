import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { AdoptionRequest } from '../../adoptions/entities/adoption-request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @ManyToMany(() => Animal, (animal) => animal.favoritedBy, { cascade: true })
  @JoinTable({ name: 'user_favorites' })
  favorites: Animal[];

  @OneToMany(() => AdoptionRequest, (request) => request.user)
  adoptionRequests: AdoptionRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
