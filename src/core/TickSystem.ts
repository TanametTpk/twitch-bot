import cron, { ScheduledTask } from 'node-cron'
import Tickable from './interfaces/Tickable'

export default class TickSystem {
    private subscribers: Tickable[]
    private task?: ScheduledTask

    constructor() {
        this.subscribers = []
    }

    public register(tickable: Tickable): void {
        this.subscribers.push(tickable)
    }

    private tick(): void {
        for (const subscriber of this.subscribers) {
            subscriber.update()
        }
    }

    public start(): void {
        for (const subscriber of this.subscribers) {
            subscriber.start()
        }
        this.task = cron.schedule('* * * * * *', this.tick.bind(this))
    }

    public stop(): void {
        if (this.task) {
            this.clearTask()
        }
    }

    public isStart(): boolean {
        return this.task === undefined
    }

    private clearTask(): void {
        this.task?.destroy()
        this.task = undefined
    }
}