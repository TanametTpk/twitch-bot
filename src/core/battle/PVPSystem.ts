import AttackError from "../../bot/errors/AttackError";
import client from "../../bot/twitch";
import Tickable from "../interfaces/Tickable";
import Player from "../Player/Player";

export default class PVPSystem implements Tickable {
    protected isOn: boolean

    constructor() {
        this.isOn = true
    }

    start(): void {}

    update(): void {}

    public getIsStatusOn(): boolean {
        return this.isOn
    }

    public toggleOnOff(): void {
        this.isOn = !this.isOn
        this.statusNotify()
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
        if (!this.isOn) return;
        if (!this.canAttackPlayer(attacked))
            throw new AttackError(`Can't Attack ${attacked.getInfo().user.name} because player is Invulnerable`)

        if (this.isHaveBlockEffect(attacked) || this.isHaveBlockEffect(attacker))
            throw new AttackError(`Can't Attack ${attacked.getInfo().user.name} because player have block effect`)
        attacker.attack(attacked)
    }

    public canAttackPlayer(player: Player): boolean {
        if (!player.isInvulnerable()) return true;
        return false;
    }

    public isHaveBlockEffect(player: Player): boolean {
        let effect = player.getEffects()
        let blockEffectList: string[] = [
            "forgotness"
        ]
        for (const name of blockEffectList) {
            if (effect.is(name)) return true
        }
        return false
    }
}