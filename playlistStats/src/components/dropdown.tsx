import React from "react";
import { useState } from "react";
import SongRatio from "./dataElements/songRatio";

const Dropdown = Spicetify.React.memo(() => {
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
                    <SongRatio />
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

export default Dropdown;
