import { character } from "../../bot/services";
import client from "../../bot/twitch";
import tick from "../helpers/tick";
import ISpell from "../interfaces/ISpell";
import Player from "../Player/Player";

export default class DamageBuffSpell implements ISpell {
    private sideEffectName: string = "ไอ้มือหนัก"

    constructor(private timeoutSeconds: number) {

    }

    check(player: Player, text: string): boolean {
        let firstChar = player.getUser().name.charAt(0)
        if (!text.startsWith("iron-fist")) return false
        if (this.countCharacter(firstChar, text.replace('iron-fist', '')) < 1) return false 
        return true
    }

    async cast(player: Player, text: string) {
        if (!this.canCastSpell(player)) return;

        let name = player.getUser().name
        let firstChar = name.charAt(0)
        let usageCoin = this.countCharacter(firstChar, text.replace('iron-fist', ''))
        if (usageCoin < 1) usageCoin = 1
        if (usageCoin > 20) usageCoin = 20
        if (player.getCoin() < usageCoin) return;

        await character.removeCoinFromCharacter(player.getInfo().id, usageCoin)
        player.setEffect(this.sideEffectName, tick.MINUTE * 30)
        
        setTimeout(() => {
            client.timeout(process.env.tmi_channel_name as string, player.getUser().name, this.timeoutSeconds)
        }, 5000)
    }

    public countCharacter(char: string, text: string): number {
        if (text.length > 20) return 0

        let count = 0
        let limit = 1
        let switchRound = 1
        let shouldBeChar = true
        for (const c of text) {
            if ((shouldBeChar && c === char) || (!shouldBeChar && c == 't')) {
                count += 1
            }else{
                count = 0
                break
            }

            limit -= 1
            if (limit <= 0) {
                limit = switchRound
                switchRound += 1
                shouldBeChar = !shouldBeChar
            }
        }        
        return count
    }

    private canCastSpell(player: Player): boolean {
        return !player.getEffects().is(this.sideEffectName)
    }
}