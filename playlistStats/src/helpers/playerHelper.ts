import playlistInformationExtension from "./PlaylistInformationExtension";

const playSong = async (uri: string) => {
    const playlistUri: string = `spotify:playlist:${playlistInformationExtension.currentPlaylistID}`;

    Spicetify.Player.playUri(uri);
    while (!Spicetify.Player.isPlaying()) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const { sessionId } = Spicetify.Platform.PlayerAPI.getState();
    Spicetify.Platform.PlayerAPI.updateContext(sessionId, {
        uri: playlistUri,
        url: `context://${playlistUri}`,
    });
};

export { playSong };
