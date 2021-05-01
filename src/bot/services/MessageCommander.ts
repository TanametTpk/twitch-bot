import ICommand from "../../interfaces/ICommand";
import IMessage from "../../interfaces/IMessage";
import ISubscriber from "../../interfaces/ISubscriber";

export default class MessageCommander implements ISubscriber<IMessage> {
    private commands!: ICommand[]

    constructor(commands: ICommand[]) {
        this.commands = commands
    }

    receive(data: IMessage): void {
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            if (command.match(data.message)) {
                command.perform(data);
                break;
            }
        }
    }
}