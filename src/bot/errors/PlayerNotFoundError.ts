
export default class PlayerNotFoundError extends Error {
    constructor(msg: string) {
        super(`Player is Not Found: ${msg}`)
    }
}