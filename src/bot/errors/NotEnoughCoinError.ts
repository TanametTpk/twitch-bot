
export default class NotEnoughCoinError extends Error {
    constructor() {
        super(`not enough coin`)
    }
}