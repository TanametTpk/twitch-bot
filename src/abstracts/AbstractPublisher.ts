import ICommand from "../interfaces/ICommand";
import Tearable from "../interfaces/Tearable";

export default abstract class AbstractPublisher<T extends ICommand> implements Tearable {
    protected commands!: T[]

    constructor(commands: T[]) {
        this.commands = commands
    }

    protected findMatchCommand(message: string): T | null {
        if (!message.startsWith("!")) return null;

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