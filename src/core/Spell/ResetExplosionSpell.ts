import { character } from "../../bot/services";
import client from "../../bot/twitch";
import ISpell from "../interfaces/ISpell";
import Player from "../Player/Player";

export default class ResetExplosionSpell implements ISpell {
    private sideEffectName: string = "หมดแรงจากการใช้เวทย์ระเบิด"

    check(player: Player, text: string): boolean {
        if (text === "reset") return true
        return false
    }

    async cast(player: Player, text: string) {
        let usageCoin = Number(process.env.RESET_EXPLOSION_COIN_USAGE) || 10
        if (player.getCoin() < usageCoin) return;

        await character.removeCoinFromCharacter(player.getInfo().id, usageCoin)
        player.removeEffect(this.sideEffectName)

        client.say(process.env.tmi_channel_name as string, `@${player.getUser().name} กลับมาแข็งแรงจากการระเบิดตัวเอง!!!`)
    }
}