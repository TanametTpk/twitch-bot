
export default class BossNotFoundError extends Error {
    constructor(msg: string) {
        super(`Boss not found Error: ${msg}`)
    }
}