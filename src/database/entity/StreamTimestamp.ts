import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class StreamTimestamp extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    timestamp!: number;
}
