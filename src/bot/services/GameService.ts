import { User } from "@prisma/client";
import GameCore from "../../core";
import Boss from "../../core/Boss/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import IGameService from "../../interfaces/services/IGameService";
import AttackError from "../errors/AttackError";
import BossNotFoundError from "../errors/BossNotFoundError";
import PlayerDeadError from "../errors/PlayerDeadError";
import PlayerNotFoundError from "../errors/PlayerNotFoundError";
import PVPModeOffError from "../errors/PVPModeOffError";
import * as services from "../services";
import roll from "../utils/roll";

class GameService implements IGameService {
    private characterService: ICharacterService
    // private game: GameManager
    private game: GameCore

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.characterService = characterService
        // this.game = new GameManager(characterService, equipmentService)
        this.game = GameCore.getInstance()
    }

    public async attackBossBy(playerId: string): Promise<void> {
        let playerManager = this.game.playerManager
        let player = playerManager.getPlayer(playerId)
        
        if (!player) {
            throw new PlayerNotFoundError("something wrong with login system")
        }

        if (!this.game.bossManager.isBossSpawn()) {
            throw new BossNotFoundError("boss is not spawn")
        }

        if (!this.game.bossManager.battleSystem.canAttackBoss(player)) {
            throw new AttackError("can't not attack boss.")
        }

        this.game.bossManager.battleSystem.attack(player, this.game.bossManager.getBoss()!)
    }

    public async pvp(attackerId: string, attackedId: string): Promise<User | null> {
        if (!this.canPVP()) throw new PVPModeOffError("Can't Attack When pvp mode is off.");
        let playerManager = this.getGameManager().playerManager
        let attacker = playerManager.getPlayer(attackerId)
        let attacked = playerManager.getPlayer(attackedId)

        if (!attacker || !attacked) throw new PlayerNotFoundError(`not found ${attacker ? "attacked player" : "attacker player"}`)

        if (attacker.isDead()) {
            throw new PlayerDeadError("Player can't pvp when they are dead.")
        }
        
        if (!playerManager.pvpSystem.canAttackPlayer(attacked)) {
            throw new AttackError("can't not attack this player.")
        }

        let deadPlayer = await this.attack(attackerId, attackedId)
        return deadPlayer
    }

    private async attack(attackerId: string, attackedId: string): Promise<User | null> {
        let attacker = this.game.playerManager.getPlayer(attackerId)
        let attacked = this.game.playerManager.getPlayer(attackedId)

        if (!attacker || !attacked) return null

        let attackerDmg = attacker.getTotalDamage()
        let attackedDmg = attacked.getTotalDamage()
        let attackDiffRatio = attackedDmg / attackerDmg
        let successRate = 100 / attackDiffRatio
        if (attackDiffRatio >= 1 && roll(successRate)) {
            attacked.attack(attacker)
            return attacked.getInfo().user
        }

        attacker.attack(attacked)
        return attacker.getInfo().user
    }

    public getBoss(): Boss | undefined {
        return this.game.bossManager.getBoss();
    }

    public getBossAttackTime(): Date | undefined {
        if (!this.game.bossManager.isBossSpawn()) return;
        let remainSecond = this.game.bossManager.getBoss()!.getBossRemainTime()
        let nextAttackTime = new Date()
        nextAttackTime.setSeconds(nextAttackTime.getSeconds() + remainSecond)
        return nextAttackTime;
    }

    public spawnBoss(): void {
        this.game.bossManager.bossSpawner.spawnBoss("normal");
    }

    public getGameManager(): GameCore {
        return this.game;
    }

    public isPlayerOnline(hash: string) {
        return this.game.playerManager.isPlayerOnline(hash);
    }

    public giveRewardToAllPlayer(coin: number): void {
        services.character.addCoinToAllCharacter(coin);
    }

    public async giveRewardToPlayer(hash: string, coin: number): Promise<void> {
        let character = await services.character.getCharacterByUserHash(hash);
        if (!character) return;

        services.character.addCoinToCharacter(character.id, coin);
    }

    public canPVP(): boolean {
        return this.game.playerManager.pvpSystem.getIsStatusOn();
    }

    public setPVPModeOn(): void {
        if (this.canPVP()) return;
        this.game.playerManager.pvpSystem.toggleOnOff()
    }

    public setPVPModeOff(): void {
        if (!this.canPVP()) return;
        this.game.playerManager.pvpSystem.toggleOnOff()
    }
}

export default GameService;