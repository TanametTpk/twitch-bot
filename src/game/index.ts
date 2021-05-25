import CharacterService from "../bot/services/CharacterService";
import BossManager from "./BossManager";
import PlayerManager, { Reward } from "./PlayerManager";
import cron from 'node-cron';
import client from '../bot/twitch';
import roll from "../bot/utils/roll";
import sleep from "../bot/utils/sleep";
import { Character } from "../database/entity/Character";
import moment from 'moment';

class GameManager {
    public bossManager: BossManager;
    public playerManager: PlayerManager;
    public attackPlayerTask: NodeJS.Timer | undefined;

    constructor() {
        this.bossManager = new BossManager();
        this.playerManager = new PlayerManager();

        this.playerManager.updateAllPlayerEquipment()
        this.scheduleEvent()
    }

    private scheduleEvent(): void {
        cron.schedule('* * 1 * * *', this.spawnBoss)
    }

    public spawnBoss(): void {
        let totalOnlineDamage: number = this.playerManager.getTotalOnlineDamage();
        this.bossManager.spawnBoss(totalOnlineDamage);
        this.attackPlayerTask = setTimeout(this.bossAttackRandomPlayer, 15 * 60 * 1000);
    }

    private clearBossAttackTask(): void {
        if (this.attackPlayerTask)
            clearTimeout(this.attackPlayerTask)

        this.bossManager.clear();
    }

    private async randomMutePlayers() {
        let channel_name = process.env.tmi_channel_name as string
        let timeoutSeconds = 180;
        let casualties = 0;
        console.log(`Boss: I am inevitible..`)

        let players = this.playerManager.getOnlinePlayers()
        for (let player of players) {
            let username = player.name
            if (roll(50)) {
                casualties++;
                console.log(`${username} got attacked.`);
                client.timeout(channel_name, username, timeoutSeconds, `โดนจมตีน`);
                await sleep(620);
            }
        }
        client.say(channel_name, `บอสทำการใช้สกิลตีหมู่ มี ${casualties} คนในแชทได้รับบาดเจ็บ....`);
    }

    private bossHasEliminated(totalReward: number): void {
        this.clearBossAttackTask();
        // TODO - distribute reward to player based on dealing damage to the boss
        // calculate reward
        let rewards: Reward[] = [];
        this.playerManager.distributeRewards(rewards);
    }

    private bossAttackRandomPlayer() {
        if (!this.bossManager.isBossHasSpawned()) return;

        this.clearBossAttackTask();
        this.randomMutePlayers();
    }

    private canBossAttackedBy(character: Character): boolean {
        let info = this.bossManager.attacker.get(character.id);
        if (!info) return true;
        
        let lasttime = moment(info.last_attack_time);
        let now = moment();
        let diffMin = now.diff(lasttime, 'seconds', true);
        return diffMin > 30;
    }

    public async attackBoss(characterId: number) {
        const player = await CharacterService.getCharacterById(characterId);
        if (!player || !this.bossManager.isBossHasSpawned() || this.canBossAttackedBy(player)) return

        let damage: number = this.playerManager.calculateAttackPowerOf(player);
        this.bossManager.rememberAttacker(player.id, damage);
        this.bossManager.getBoss()?.wasAttack(damage);
    }
}

export default new GameManager();