import AttackError from "../../bot/errors/AttackError";
import client from "../../bot/twitch";
import Tickable from "../interfaces/Tickable";
import Player from "../Player/Player";

export default class PVPSystem implements Tickable {
    protected isOn: boolean

    constructor() {
        this.isOn = true
    }

    start(): void {
        this.statusNotify()
    }

    update(): void {}

    public getIsStatusOn(): boolean {
        return this.isOn
    }

    public toggleOnOff(): void {
        this.isOn = !this.isOn
    }

    public statusNotify(): void {
        let status: string = this.isOn ? "เปิด" : "ปิด"
        this.notify(`pvp ${status}แล้ว`)
    }

    public getRemainTime(): number {
        return -1
    }

    protected notify(text: string): void {
        client.say(process.env.tmi_channel_name as string, text)
    }

    public attack(attacker: Player, attacked: Player): void {
        if (!this.canAttackPlayer)
            throw new AttackError(`Can't Attack ${attacked.getInfo().user.name} because player is Invulnerable`)
        attacker.attack(attacked)
    }

    public canAttackPlayer(player: Player): boolean {
        if (!player.isInvulnerable()) return true;
        return false;
    }
}