import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Boss extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    maxHp!: number;

    @Column()
    hp!: number;

    @Column()
    reward!: number;

    @Column()
    level!: number;
}
