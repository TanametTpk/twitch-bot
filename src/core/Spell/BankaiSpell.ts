import { character } from "../../bot/services";
import client from "../../bot/twitch";
import tick from "../helpers/tick";
import ISpell from "../interfaces/ISpell";
import BaseAttackBuff from "../Player/Buffs/BaseAttackBuff";
import Player from "../Player/Player";

export default class BankaiSpell implements ISpell {
    private sideEffectName: string = "กูจะรู้หรอว่าบังไค"

    constructor(private timeoutSeconds: number) {

    }

    check(player: Player, text: string): boolean {
        if (!text.startsWith("บังไค")) return false
        return true
    }

    async cast(player: Player, text: string) {
        if (!this.canCastSpell(player)) return;

        let usageCoin = this.countCharacter(text.replace('บังไค', ''))
        if (usageCoin < 1) usageCoin = 1
        if (usageCoin > 20) usageCoin = 20
        if (player.getCoin() < usageCoin) return;

        await character.removeCoinFromCharacter(player.getInfo().id, usageCoin)
        player.setEffect(this.sideEffectName, tick.MINUTE * 30)
        player.buffManager.add(new BaseAttackBuff("iron-fist", tick.MINUTE * 31, usageCoin * 2))
        
        setTimeout(() => {
            client.timeout(process.env.tmi_channel_name as string, player.getUser().name, this.timeoutSeconds)
        }, 5000)
    }

    public countCharacter(text: string): number {
        let count: number = 1;
        for (const t of text) {
            if (t==="ค") count++;
        }
        return count
    }

    private canCastSpell(player: Player): boolean {
        return !player.getEffects().is(this.sideEffectName)
    }
}