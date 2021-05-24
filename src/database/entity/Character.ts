import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, BaseEntity} from "typeorm";
import { CharacterEquipment } from "./CharacterEquipment";
import {User} from './User';

@Entity()
export class Character extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => User)
    @JoinColumn()
    user!: User;

    @OneToOne(type => CharacterEquipment, {onUpdate: 'CASCADE', onDelete: 'CASCADE', nullable: true})
    @JoinColumn()
    equipment!: CharacterEquipment | null;

    @Column()
    coin!: number;

    @Column()
    hp!: number;

    @Column()
    max_hp!: number;

    @Column()
    atk!: number;
}
