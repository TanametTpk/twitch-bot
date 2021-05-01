import ICommand from "../interfaces/ICommand";
import IMessage from "../interfaces/IMessage";
import IPublisher from "../interfaces/IPublisher";
import ISubscriber from "../interfaces/ISubscriber";
import Tearable from "../interfaces/Tearable";

export default abstract class AbstractPublisher implements Tearable {
    private commands!: ICommand[]

    constructor(commands: ICommand[]) {
        this.commands = commands
    }

    protected findMatchCommand(message: string): ICommand | null {
        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            if (command.match(message)) {
                return command;
            }
        }
        return null;
    }

    public abstract start(): void

    public abstract stop(): void
}