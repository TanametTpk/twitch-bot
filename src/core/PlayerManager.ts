import moment from 'moment';
import AutoTogglePVPSystem from './battle/AutoTogglePVPSystem';
import PVPSystem from './battle/PVPSystem';
import EquipmentChecker from './Equipment/EquipmentChecker';
import tick from './helpers/tick';
import Tickable from './interfaces/Tickable';
import Player from './Player/Player';

export interface OnlinePlayerInfo {
    player: Player
    lastAtive: Date
}

export default class PlayerManager implements Tickable {
    private static instance: PlayerManager;
    public pvpSystem: PVPSystem;
    public equipmentChecker: EquipmentChecker;
    private onlinePlayers: Map<string, OnlinePlayerInfo>;

    private constructor() {
        this.onlinePlayers = new Map();
        this.equipmentChecker = new EquipmentChecker();

        this.pvpSystem = new PVPSystem()
        if (process.env.ALLOW_AUTO_PVP === "true") {
            let pvpDuration: number = Number(process.env.PVP_TIME || tick.HOUR)
            let allowPvpTime: number = Number(process.env.PVP_DURATION_TIME || tick.HOUR)
            let notifyTime: number = Number(process.env.PRE_NOTIFY_PVP_TIME || tick.MINUTE)
            this.pvpSystem = new AutoTogglePVPSystem(pvpDuration, allowPvpTime, notifyTime)
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

        this.onlinePlayers.forEach((info: OnlinePlayerInfo) => {
            info.player.update()
        })
    }

    public async addOnlinePlayer(player: Player) {
        this.onlinePlayers.set(player.getId(), {
            player,
            lastAtive: new Date()
        });
    }

    public async removeOnlinePlayer(player: Player) {
        this.onlinePlayers.delete(player.getId());
    }

    public getOnlinePlayers(): Player[] {
        return Array.from(this.onlinePlayers.values()).map(info => info.player);
    }

    public getTotalOnlineDamage(): number {
        let total = 0
        this.onlinePlayers.forEach((info: OnlinePlayerInfo) => {
            if (moment.duration(moment(new Date()).diff(info.lastAtive)).asSeconds() <= (process.env.PLAYER_ACTIVE_TIME || 1800))
                total += info.player.getTotalDamage()
        })
        return total;
    }

    public isPlayerOnline(playerId: string): boolean {
        return this.onlinePlayers.has(playerId);
    }

    public getPlayer(playerId: string): Player | undefined {
        return this.onlinePlayers.get(playerId)?.player
    }
}