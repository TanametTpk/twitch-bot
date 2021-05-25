import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";

class AddCoinAction extends AbstractChannelPointAction {
    constructor() {
        super("test");
    }

    perform(): void {
        // add coin here
        console.log("add coin to user");
    }
}

export default new AddCoinAction();