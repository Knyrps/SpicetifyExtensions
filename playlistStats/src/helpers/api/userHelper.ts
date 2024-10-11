const getUserSubscription = async (): Promise<string | null> => {
    while (!(Spicetify?.CosmosAsync && Spicetify.CosmosAsync.get)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
        const res = await Spicetify.CosmosAsync.get(
            "https://api.spotify.com/v1/me"
        );
        const product = res?.product;
        return product;
    } catch (ex) {
        console.error("Failed to get user subscription", ex);
        return null;
    }
};

export { getUserSubscription };
