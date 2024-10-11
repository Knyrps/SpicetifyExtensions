import React from "react";

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

export { SpotifyButton };
