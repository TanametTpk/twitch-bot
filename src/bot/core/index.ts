import CharacterService from "../services/CharacterService";
import BossManager from "./BossManager";
import PlayerManager, { Reward } from "./PlayerManager";
import cron, { ScheduledTask } from 'node-cron';

class GameManager {
    public bossManager: BossManager;
    public playerManager: PlayerManager;
    public attackPlayerTask: ScheduledTask | undefined;

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
        this.bossManager.spawnBoss();
        this.attackPlayerTask = cron.schedule('* 15 * * * *', this.bossAttackRandomPlayer)
    }

    private randomMutePlayers(): void {
        // TODO - get all online player
        // random player
        // mute and sleep
    }

    private bossHasEliminated(totalReward: number): void {
        this.attackPlayerTask?.destroy()
        // TODO - distribute reward to player based on dealing damage to the boss
        // calculate reward
        let rewards: Reward[] = []
        this.playerManager.distributeRewards(rewards)
    }

    private bossAttackRandomPlayer() {
        if (!this.bossManager.isBossHasSpawned()) return;

        this.attackPlayerTask?.destroy()
        this.randomMutePlayers();
    }

    public async attackBoss(characterId: number) {
        const player = await CharacterService.getCharacterById(characterId);
        if (!player || !this.bossManager.isBossHasSpawned()) return

        let damage: number = this.playerManager.calculateAttackPowerOf(player);
        this.bossManager.rememberAttacker(player.id, damage);
        this.bossManager.getBoss()?.wasAttack(damage);
    }
}

export default new GameManager();