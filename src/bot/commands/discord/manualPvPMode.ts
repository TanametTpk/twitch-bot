import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import services from "../../services";

class AddCoinToUsernameCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!pvp mode (on|off)/.test(text);
    }

    async perform(msg: Message) {
        let mode = msg.content.split(" ")[2];
        let isOn = mode === "on"
        if (isOn) services.game.setPVPModeOn()
        if (!isOn) services.game.setPVPModeOff()

        msg.channel.send(`${isOn ? "เปิด": "ปิด"} mode pvp แล้ว`);
    }
}

export default new AddCoinToUsernameCommand();