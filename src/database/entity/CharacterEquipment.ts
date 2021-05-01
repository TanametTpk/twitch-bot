import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, BaseEntity} from "typeorm";
import {Character} from './Character';

@Entity()
export class CharacterEquipment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => Character)
    @JoinColumn()
    character!: Character;

    @Column()
    expired_time!: number;

    @Column()
    atk!: number;
}
