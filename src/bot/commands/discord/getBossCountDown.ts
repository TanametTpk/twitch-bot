import { Message } from "discord.js";
import moment from "moment";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import * as services from "../../services";

class GetBossCountDownCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss countdown";
    }

    getHelp(): string {
        return "!boss countdown";
    }

    perform(msg: Message): void {
        let game: IGameService = services.game;
        let attackTime = game.getBossAttackTime();

        if (!attackTime) {
            msg.channel.send("บอสจะตีมึงได้ไง มันยังไม่เกิดเลย คิดดิคิด");
            return;
        }

        let nextAttackTime = moment(attackTime).diff(new Date(), 'minutes', true);
        msg.channel.send(`อีก ${nextAttackTime} นาที มึงโดนบอสตีแน่`);
    }
}

export default new GetBossCountDownCommand();