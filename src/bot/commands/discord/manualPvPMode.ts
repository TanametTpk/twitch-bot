import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class ManualPVPMode implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!pvp mode (on|off)/.test(text);
    }

    getHelp(): string {
        return "!pvp mode <on|off> - Sets the PvP mode to on or off";
    }

    async perform(msg: Message) {
        let mode = msg.content.split(" ")[2];
        let isOn = mode === "on"
        if (isOn) services.game.setPVPModeOn()
        if (!isOn) services.game.setPVPModeOff()

        msg.channel.send(`${isOn ? "เปิด": "ปิด"} mode pvp แล้ว`);
    }
}

export default new ManualPVPMode();