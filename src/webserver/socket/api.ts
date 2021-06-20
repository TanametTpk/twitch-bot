import randomIntBetween from '../../bot/utils/randomIntBetween';
import Boss from '../../game/Boss';
import IBossApi from '../../interfaces/websocket/IBossApi';
import IFeedApi, { NotificationPlacement } from '../../interfaces/websocket/IFeedApi';
import { io } from '../server';

export default class WebSocketApi implements IFeedApi, IBossApi {
    private static instance: WebSocketApi

    private constructor() {}

    public static getInstance(): WebSocketApi {
        if (!WebSocketApi.instance) {
            WebSocketApi.instance = new WebSocketApi();
        }

        return WebSocketApi.instance;
    }

    updateBoss(boss: Boss, wasAttack: boolean = false): void {
        let imageName = "boss.png"
        let dmgImages = [
            "bossAngry.png",
            "bossShake.png"
        ]

        if (wasAttack) {
            imageName = dmgImages[randomIntBetween(0, dmgImages.length - 1)]
        }

        let info = {
            hp: boss.getHp(),
            max_hp: boss.getMaxHp(),
            level: boss.getLevel(),
            image: `http://localhost:8080/assets/${imageName}`
        }
        io.emit("boss:update", info)
    }

    bossEliminated(): void {
        io.emit("boss:eliminated")
    }

    showFeed(message: string, placement: NotificationPlacement, duration: number): void {
        io.emit("feed:message", message, placement, duration)
    }
}