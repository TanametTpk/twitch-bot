import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, BaseEntity} from "typeorm";
import {User} from './User';

@Entity()
export class Character extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => User)
    @JoinColumn()
    user!: User;

    @Column()
    coin!: number;

    @Column()
    hp!: number;

    @Column()
    max_hp!: number;

    @Column()
    atk!: number;
}
