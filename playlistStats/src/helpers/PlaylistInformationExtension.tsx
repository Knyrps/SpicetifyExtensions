import { customTrim } from "./utilHelper";
import colorPalette from "./colorHelper";
import Dropdown from "../components/dropdown";

class PlaylistInformationExtension {
    run() {
        this.SetupListeners();
    }

    _currentRoute: string = "/";
    currentPlaylistID: string = "";
    _domElement: HTMLElement | undefined;

    SetupListeners = () => {
        this.InitDom(Spicetify.Platform.History.location);
        Spicetify.Platform.History.listen(async (location: Location) => {
            this.InitDom(location);
        });
    };

    InitDom = (location: Location) => {
        if (this.TryGetPlaylist(location)) {
            setTimeout(() => {
                this.CreateDomComponent();
                this._currentRoute = location.pathname;
            }, 100);
        }
    };

    TryGetPlaylist = (location: Location) => {
        var pathsegments = customTrim(location.pathname, "/").split("/");
        if (pathsegments[0] != "playlist") {
            return false;
        }

        var playlistId = pathsegments[1];
        this.currentPlaylistID = playlistId;
        return true;
    };

    CreateDomComponent = () => {
        const insertBeforeSelector = "div.playlist-playlist-playlistContent";
        const colors = colorPalette.colors;
        if (!Object.keys(colorPalette.colors).length) {
            if (Object.keys(colorPalette.colors).length) {
                console.info("Colors loaded");
            }
        }
        if (
            !(
                document.querySelector(insertBeforeSelector) &&
                Spicetify.Platform.History &&
                Object.keys(colorPalette.colors).length
            )
        ) {
            setTimeout(this.CreateDomComponent, 10);
            return;
        }

        var playlistContentElement = document?.querySelector(
            "div#main " + insertBeforeSelector
        );

        if (
            !playlistContentElement ||
            playlistContentElement ==
                this._domElement?.parentElement?.querySelector(
                    insertBeforeSelector
                )
        ) {
            return;
        }

        var playlistInfoWrapper = document.createElement("div");
        playlistInfoWrapper.classList.add(
            "playlist-information-wrapper",
            "contentSpacing"
        );
        playlistContentElement.parentElement?.insertBefore(
            playlistInfoWrapper,
            playlistContentElement
        );

        this._domElement = playlistInfoWrapper;

        Spicetify.ReactDOM.render(
            Spicetify.React.createElement(Dropdown),
            playlistInfoWrapper
        );
    };
}

var playlistInformationExtension: PlaylistInformationExtension =
    new PlaylistInformationExtension();

export default playlistInformationExtension;
