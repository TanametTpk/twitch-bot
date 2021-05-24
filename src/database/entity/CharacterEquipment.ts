import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, BaseEntity} from "typeorm";
import {Character} from './Character';

@Entity()
export class CharacterEquipment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => Character, character => character.equipment)
    @JoinColumn()
    character!: Character;

    @Column()
    expired_time!: number;

    @Column('time')
    last_time_check!: Date;

    @Column()
    atk!: number;
}
