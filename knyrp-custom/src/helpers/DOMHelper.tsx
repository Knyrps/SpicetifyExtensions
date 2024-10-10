import React from "react";
import { customTrim } from "./utilHelper";

export class DOMHelper {
    constructor() {
        this.SetupListeners();
    }

    _currentRoute: string = "/";
    _currentPlaylistID: string = "";
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
        this._currentPlaylistID = playlistId;
        return true;
    };

    CreateDomComponent = () => {
        const insertBeforeSelector = "div.playlist-playlist-playlistContent";
        if (
            !(
                document.querySelector(insertBeforeSelector) &&
                Spicetify.Platform.History
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
            Spicetify.React.createElement(DataElement),
            playlistInfoWrapper
        );
    };
}

const DataElement = Spicetify.React.memo(() => {
    return (
        <div className="playlist-information-wrapper__inner dropdown">
            <div className="grid">
                <div className="information-column">Col 1</div>
                <div className="information-column">Col 2</div>
                <div className="information-column">Col 3</div>
                <DropdownToggle />
            </div>
        </div>
    );
});

const SpotifyButton = Spicetify.React.memo(
    (
        props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLButtonElement> &
            React.ButtonHTMLAttributes<HTMLButtonElement>
    ) => {
        props.className = `Button-buttonSecondary-medium-useBrowserDefaultFocusStyle encore-text-body-medium-bold ${
            props.className || ""
        }`;

        return <button {...props}>{props.children}</button>;
    }
);

const DropdownToggle = Spicetify.React.memo(
    (
        props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLButtonElement> &
            React.ButtonHTMLAttributes<HTMLButtonElement>
    ) => {
        props.className = `button-dropdown Button-buttonSecondary-medium-useBrowserDefaultFocusStyle encore-text-body-medium-bold ${
            props.className || ""
        }`;

        return (
            <button {...props}>
                <div className="button-dropdown__icon"></div>
            </button>
        );
    }
);
