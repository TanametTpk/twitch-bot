import { User } from "@prisma/client";
import GameManager from "../../game";
import Boss from "../../game/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import IGameService from "../../interfaces/services/IGameService";
import AttackError from "../errors/AttackError";
import BossNotFoundError from "../errors/BossNotFoundError";
import PlayerDeadError from "../errors/PlayerDeadError";
import PVPModeOffError from "../errors/PVPModeOffError";
import services from "../services";
import roll from "../utils/roll";

class GameService implements IGameService {
    private characterService: ICharacterService
    private game: GameManager

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.characterService = characterService
        this.game = new GameManager(characterService, equipmentService)
    }

    public async attackBossBy(playerId: string): Promise<void> {
        let playerManager = this.getGameManager().playerManager
        let character = await this.characterService.getCharacterByUserHash(playerId);
        if (!character) return;

        if (!this.game.bossManager.isBossHasSpawned()) {
            throw new BossNotFoundError("boss is not spawn")
        }

        if (playerManager.isPlayerDead(playerId)) {
            throw new PlayerDeadError("can't attack boss because player is dead.")
        }

        if (!this.game.canBossAttackedBy(character)) {
            throw new AttackError("can't not attack boss.")
        }

        this.game.attackBoss(character.id)
    }

    public async pvp(attackerId: string, attackedId: string): Promise<User | null> {
        if (!this.canPVP()) throw new PVPModeOffError("Can't Attack When pvp mode is off.");
        let playerManager = this.getGameManager().playerManager

        if (playerManager.isPlayerDead(attackerId)) {
            throw new PlayerDeadError("Player can't pvp when they are dead.")
        }
        
        if (!playerManager.canAttackPlayer(attackedId)) {
            throw new AttackError("can't not attack this player.")
        }

        let deadPlayer = await this.attack(attackerId, attackedId)
        if (deadPlayer) {
            // playerManager.addDeadPlayer(deadPlayer)
        }

        return deadPlayer
    }

    private async attack(attackerId: string, attackedId: string): Promise<User | null> {
        let attacker = await this.characterService.getCharacterByUserHash(attackerId)
        let attacked = await this.characterService.getCharacterByUserHash(attackedId)

        if (!attacker || !attacked) return null

        let attackerDmg = this.game.playerManager.calculateAttackPowerOf(attacker)
        let attackedDmg = this.game.playerManager.calculateAttackPowerOf(attacked)
        let attackDiffRatio = attackedDmg / attackerDmg
        if (attackDiffRatio < 1) return attacked.user

        let successRate = 100 / attackDiffRatio
        if (roll(successRate)) return attacked.user
        return attacker.user
    }

    public getBoss(): Boss | undefined {
        return this.game.bossManager.getBoss();
    }

    public getBossAttackTime(): Date | undefined {
        return this.game.getBossNextAttack();
    }

    public spawnBoss(): void {
        this.game.spawnBoss();
    }

    public getGameManager(): GameManager {
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
        return this.game.getCanPvp();
    }

    public setPVPModeOn(): void {
        if (this.game.getCanPvp()) return;
        this.game.toggleEnableDisablePvp()
    }

    public setPVPModeOff(): void {
        if (!this.game.getCanPvp()) return;
        this.game.toggleEnableDisablePvp();
    }
}

export default GameService;