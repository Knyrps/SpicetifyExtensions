import React, { useState } from "react";
import { customTrim } from "./utilHelper";
import { getWidth } from "./clientSizeHelper";

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
    const [dropdownActive, setDropdownActive] = useState<Boolean>(false);

    return (
        <div
            className={`playlist-information-wrapper__inner dropdown ${
                dropdownActive ? "active" : ""
            }`}
        >
            <div
                className="dropdown-controls"
                onClick={() => setDropdownActive(!dropdownActive)}
            >
                <div className="information-row title">Statistics</div>
                <DropdownToggle />
            </div>
            <hr />
            <div className="contents">
                <div className="information-row">
                    <span>Song Ratio: 100 (Knyrps) | 150 (Armenier)</span>
                </div>
                <div className="information-row">Row 2</div>
                <div className="information-row">Row 3</div>
            </div>
        </div>
    );
});

const DropdownToggle = Spicetify.React.memo(() => {
    return (
        <div className="dropdown-toggle-wrap">
            <button className="button-dropdown Button-buttonSecondary-medium-useBrowserDefaultFocusStyle encore-text-body-medium-bold">
                <div className="button-dropdown__icon"></div>
            </button>
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
