import { Character, Equipment, User } from "@prisma/client";
import { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService";
import Attackable from "../interfaces/Attackable";
import Damagable from "../interfaces/Damagable";
import Tickable from "../interfaces/Tickable";
import EffectManager from "../Time/EffectManager";
import BuffManager from "./BuffManager";
import Effect from "./Effect";

export default class Player implements Attackable, Damagable, Tickable {
    private info: Character & IncludeUserAndEquipment
    private effectManager: EffectManager
    public buffManager: BuffManager

    constructor(info: Character & IncludeUserAndEquipment) {
        this.info = info
        this.effectManager = new EffectManager()
        this.buffManager = new BuffManager()
    }
    
    public start(): void {}

    public update(): void {
        this.effectManager.update()
    }

    public attack(object: Damagable): void {
        this.buffManager.triggerAttack()
        object.wasAttack(this.getTotalDamage(true))
    }

    public wasAttack(dmg: number): void {
        if (dmg < 1) return
        this.effectManager.addEffect("dead", 60)
    }

    public getCoin(): number {
        return this.info.coin
    }

    public getBaseAtk(withBuff: boolean = false): number {
        if (withBuff) return this.info.atk + this.buffManager.getDmg()
        return this.info.atk
    }

    public getTotalDamage(withBuff: boolean = false): number {
        let total = this.getBaseAtk(withBuff)
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

    public setEquipment(equipment: Equipment | null): void {
        this.info.equipment = equipment
    }

    public getUser(): User {
        return this.info.user
    }

    public getInfo(): Character & IncludeUserAndEquipment {
        return this.info
    }

    public setInfo(info: Character & IncludeUserAndEquipment): void {
        this.info = info
    }

    public isInvulnerable(): boolean {
        return this.effectManager.getEffectDuration("invulnerable") > 0
    }

    public setInvalnerable(duration: number) {
        if (duration < 1) return
        this.effectManager.addEffect("invulnerable", duration)
    }

    public getId(): string {
        return this.info.user.hash
    }

    public isDead(): boolean {
        return this.effectManager.getEffectDuration("dead") > 0
    }

    public getRespawnTime(): number {
        return this.effectManager.getEffectDuration("dead")
    }

    public getEffects(): Effect {
        return this.effectManager.getEffect()
    }

    public removeEffect(name: string): void {
        this.effectManager.addEffect(name, 0)
    }

    public setEffect(name: string, duration: number): void {
        this.effectManager.addEffect(name, duration)
    }
}