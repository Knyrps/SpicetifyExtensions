import "styles/styles.scss";
import "styles/icons.scss";
import "styles/vars.scss";
import app from "./helpers/PlaylistInformationExtension";
import { getUserSubscription } from "./helpers/api/userHelper";
import { getOldestSong } from "./helpers/playlistHelper";

async function main() {
    while (!Spicetify?.showNotification) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const subscription = await checkSubscription();

    // Initialize
    if (!subscription) {
        Spicetify.showNotification(
            "No premium subscription found, playlist stats extension currently requires a Spotify Premium subscription",
            false,
            3000
        );
        return;
    }

    app.run();
}

const checkSubscription = async () => {
    const subscription = await getUserSubscription();
    return subscription == "premium";
};

export default main;
