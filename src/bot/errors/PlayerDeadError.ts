
export default class PlayerDeadError extends Error {
    constructor(msg: string) {
        super(`Player is Dead: ${msg}`)
    }
}