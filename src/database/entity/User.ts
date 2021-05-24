import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100
    })
    name!: string;

    @Index({ unique: true })
    @Column({
        length: 100
    })
    hash!: string;
}
