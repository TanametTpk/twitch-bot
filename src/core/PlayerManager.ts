import ICharacterService from '../interfaces/services/ICharacterService';
import IEquipmentService from '../interfaces/services/IEquipmentService';
import AutoTogglePVPSystem from './battle/AutoTogglePVPSystem';
import PVPSystem from './battle/PVPSystem';
import EquipmentChecker from './Equipment/EquipmentChecker';
import tick from './helpers/tick';
import Tickable from './interfaces/Tickable';
import Player from './Player/Player';

export default class PlayerManager implements Tickable {
    private static instance: PlayerManager;
    public pvpSystem: PVPSystem;
    public equipmentChecker: EquipmentChecker;
    private onlinePlayers: Map<string, Player>;

    private constructor() {
        this.onlinePlayers = new Map();
        this.equipmentChecker = new EquipmentChecker();

        this.pvpSystem = new PVPSystem()
        if (process.env.ALLOW_AUTO_PVP === "true") {
            let pvpDuration: number = Number(process.env.PVP_TIME || tick.HOUR)
            let notifyTime: number = Number(process.env.PRE_NOTIFY_PVP_TIME || tick.MINUTE)
            this.pvpSystem = new AutoTogglePVPSystem(pvpDuration, notifyTime)
        }
    }

    public static getInstance(): PlayerManager {
        if (!PlayerManager.instance) {
            PlayerManager.instance = new PlayerManager();
        }

        return PlayerManager.instance;
    }

    start(): void {
        this.equipmentChecker.start()
        this.pvpSystem.start()
    }

    update(): void {
        this.equipmentChecker.update()
        this.pvpSystem.update()

        this.onlinePlayers.forEach((player: Player) => {
            player.update()
        })
    }

    public async addOnlinePlayer(player: Player) {
        if (this.onlinePlayers.has(player.getId())) return;
        this.onlinePlayers.set(player.getId(), player);
    }

    public async removeOnlinePlayer(player: Player) {
        if (!this.onlinePlayers.has(player.getId())) return;
        this.onlinePlayers.delete(player.getId());
    }

    public getOnlinePlayers(): Player[] {
        return Array.from(this.onlinePlayers.values());
    }

    public getTotalOnlineDamage(): number {
        let total = 0
        this.onlinePlayers.forEach((player: Player) => {
            total += player.getTotalDamage()
        })
        return total;
    }

    public isPlayerOnline(playerId: string): boolean {
        return this.onlinePlayers.has(playerId);
    }

    public getPlayer(playerId: string): Player | undefined {
        return this.onlinePlayers.get(playerId)
    }
}