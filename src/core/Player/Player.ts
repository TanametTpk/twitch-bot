import { Character, Equipment, User } from "@prisma/client";
import { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService";
import Attackable from "../interfaces/Attackable";
import Damagable from "../interfaces/Damagable";
import Tickable from "../interfaces/Tickable";

export default class Player implements Attackable, Damagable, Tickable {
    private info: Character & IncludeUserAndEquipment
    private currentInvulnerable: number
    private remainRespawnTime: number

    constructor(info: Character & IncludeUserAndEquipment) {
        this.info = info
        this.currentInvulnerable = 0
        this.remainRespawnTime = 0
    }
    
    public start(): void {}

    public update(): void {
        this.currentInvulnerable -= 1
        this.remainRespawnTime -= 1

        if (this.currentInvulnerable < 1) {
            this.currentInvulnerable = 0
        }

        if (this.remainRespawnTime < 1) {
            this.remainRespawnTime = 0
        }
    }

    public attack(object: Damagable): void {
        object.wasAttack(this.getTotalDamage())
    }

    public wasAttack(dmg: number): void {
        if (dmg < 1) return
        this.remainRespawnTime = 60
    }

    public getCoin(): number {
        return this.info.coin
    }

    public getBaseAtk(): number {
        return this.info.atk
    }

    public getTotalDamage(): number {
        let total = this.getBaseAtk()
        if (this.isHaveEquipment())
            total += this.getEquipment()!.atk
        return total
    }

    public isHaveEquipment(): boolean {
        return this.info.equipment !== null
    }

    public getEquipment(): Equipment | null {
        return this.info.equipment
    }

    public setEquipment(equipment: Equipment): void {
        this.info.equipment = equipment
    }

    public getUser(): User {
        return this.info.user
    }

    public getInfo(): Character & IncludeUserAndEquipment {
        return this.info
    }

    public isInvulnerable(): boolean {
        return this.currentInvulnerable < 1
    }

    public setInvalnerable(duration: number) {
        if (duration < 1) return
        this.currentInvulnerable = duration
    }

    public getId(): string {
        return this.info.user.hash
    }

    public isDead(): boolean {
        return this.remainRespawnTime > 0
    }
}