import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";

class AddCoinAction extends AbstractChannelPointAction {
    constructor() {
        super("68d5382c-f30b-45bf-842b-da7f50811eeb");
    }

    perform(): void {
        // add coin here
        console.log("add coin to user");
    }
}

export default new AddCoinAction();