
export default class BuyBadItemError extends Error {
    constructor(msg: string) {
        super(`Buy Bad Item Error: ${msg}`)
    }
}