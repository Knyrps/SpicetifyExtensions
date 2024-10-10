import { DOMHelper } from "./helpers/DOMHelper";
import "styles/styles.scss";
import "styles/icons.scss";
import "styles/vars.scss";

async function main() {
    while (!Spicetify?.showNotification) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Show message on start.
    Spicetify.showNotification("Fuck You");
    const domHelper = new DOMHelper();
}

export default main;
