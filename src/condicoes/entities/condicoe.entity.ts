import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Condicoes {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    temperatura_agua: string;

    @Column()
    umidade: string;

    @Column()
    temperatura_ar: string;

}
