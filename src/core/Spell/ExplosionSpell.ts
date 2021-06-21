import client from "../../bot/twitch";
import roll from "../../bot/utils/roll";
import sleep from "../../bot/utils/sleep";
import BossManager from "../BossManager";
import ISpell from "../interfaces/ISpell";
import Player from "../Player/Player";
import PlayerManager from "../PlayerManager";

export default class ExplosionSpell implements ISpell {
    constructor(private timeoutSeconds: number) {

    }

    check(player: Player, text: string): boolean {
        if (!text.startsWith("!spell ความมืดเหนือความมืดทั้งปวง ")) return false
        if (!text.endsWith(" explosion")) return false
        return true
    }

    async cast(player: Player, text: string) {
        text = text.replace("!spell ความมืดเหนือความมืดทั้งปวง ", "")
        text = text.replace(" explosion", "")
        let name = player.getUser().name
        let last_character = name[name.length - 1]
        let usageCoin = this.countCharacter(last_character, text)
        if (usageCoin < 1) usageCoin = 1
        if (usageCoin > 10) usageCoin = 10

        let dmg = this.calculateDamage(player, usageCoin)
        let bossManager = BossManager.getInstance()

        player.wasAttack(dmg)
        client.timeout(process.env.tmi_channel_name as string, player.getUser().name, usageCoin)
        client.say(process.env.tmi_channel_name as string, `@${player.getUser().name} ระเบิดตัวเองตาย ด้วยเวทมนต์ระเบิด`)

        if (!this.isCastSuccess(usageCoin)) return;
        this.drawBomb()

        if (bossManager.isBossSpawn()) {
            bossManager.getBoss()?.wasAttack(dmg)
        }

        this.explosionOtherPlayer(player, usageCoin)
    }

    private countCharacter(char: string, text: string): number {
        let count = 0
        for (const c of text) {
            if (c === char) count += 1 
        }
        return count
    }

    private isCastSuccess(coin: number): boolean {
        let chance = this.calculateChance(coin)
        return roll(chance)
    }

    private calculateDamage(player: Player, coin: number): number {
        return player.getTotalDamage() * coin
    }

    private calculateChance(coin: number): number {
        return -9 * coin + 100
    }

    private drawBomb(): void {
        let text = `
)
(
.-'-.
:   :
:TNT:
:___:
`
        let lines = text.split("\n")
        for (const line of lines) {
            client.say(process.env.tmi_channel_name as string, line)
        }
    }

    private async explosionOtherPlayer(player: Player, coin: number) {
        let channel_name = process.env.tmi_channel_name as string
        let casualties = 0;
        let players = PlayerManager.getInstance().getOnlinePlayers()
        
        for (let player of players) {
            let username = player.getInfo().user.name
            if (roll(coin)) {
                casualties++;
                client.timeout(channel_name, username, this.timeoutSeconds, `โดนระเบิดจากเพื่อน`);
                await sleep(620);
            }
        }
        client.say(channel_name, `มี ${casualties} คนในแชท โดนลูกหลง จากระเบิดของ ไอ้นี่ -> ${player.getUser().name}`);
    }
}