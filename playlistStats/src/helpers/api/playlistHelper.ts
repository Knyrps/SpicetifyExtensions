import { CollaborationModel } from "../playlistHelper";
import playlistInformationExtension from "../PlaylistInformationExtension";

const waitForSpicetify = async () => {
    while (!(Spicetify?.CosmosAsync && Spicetify.CosmosAsync.get)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};

const fetchFromSpotify = async (url: string) => {
    await waitForSpicetify();
    try {
        return await Spicetify.CosmosAsync.get(url);
    } catch (ex) {
        console.error(`Failed to fetch from ${url}`, ex);
        return null;
    }
};

const getPlaylistId = () => playlistInformationExtension.currentPlaylistID;

const fetchAllItems = async (url: string, limit: number) => {
    let allItems: any[] = [];
    let nextOffset = 0;
    let hasMore = true;

    while (hasMore) {
        const res = await fetchFromSpotify(
            `${url}&offset=${nextOffset}&limit=${limit}`
        );
        if (res) {
            allItems = allItems.concat(res.items);
            nextOffset += limit;
            hasMore = !!res.next;
        } else {
            hasMore = false;
        }
    }

    return allItems;
};

const getPlaylist = async () => {
    const playlistId = getPlaylistId();
    return await fetchFromSpotify(
        `https://api.spotify.com/v1/playlists/${playlistId}`
    );
};

const getPlaylistSongs = async (params: {
    all?: boolean;
    offset: number;
    limit: number;
}): Promise<{}[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${params.limit}`;

    if (params.all) {
        return await fetchAllItems(url, params.limit);
    } else {
        const res = await fetchFromSpotify(`${url}&offset=${params.offset}`);
        return res ? res.items : [];
    }
};

const getPlaylistSongsAddedAt = async (): Promise<{}[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(added_at,track(name,id,artists(name)))`;
    return await fetchAllItems(url, 50);
};

const getPlaylistSongsAddedBy = async (): Promise<CollaborationModel[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(added_by(id))`;
    const allResults = await fetchAllItems(url, 50);

    const addedByCount: { [key: string]: number } = {};
    allResults.forEach((song: any) => {
        const addedBy = song.added_by.id;
        addedByCount[addedBy] = (addedByCount[addedBy] || 0) + 1;
    });

    const ids = Object.entries(addedByCount).map(([addedBy, count]) => ({
        addedBy,
        count,
    }));
    const collaborators = await Promise.all(
        ids.map(async (user) => {
            const res = await fetchFromSpotify(
                `https://api.spotify.com/v1/users/${user.addedBy}?fields=display_name`
            );
            return { name: res.display_name, value: user.count };
        })
    );

    return collaborators;
};

const getPlaylistSongsLength = async (): Promise<{}[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(track(duration_ms))`;
    return await fetchAllItems(url, 100);
};

const getGenres = async (): Promise<{ genre: string; songIds: string[] }[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(track(id,artists(id)))`;
    const allSongs = await fetchAllItems(url, 100);

    const artistIds = allSongs.flatMap((song) =>
        song.track.artists.map((artist: { id: any }) => artist.id)
    );
    const songIdMap = allSongs.reduce((map, song) => {
        song.track.artists.forEach((artist: { id: string | number }) => {
            if (!map[artist.id]) {
                map[artist.id] = [];
            }
            map[artist.id].push(song.track.id);
        });
        return map;
    }, {} as { [key: string]: string[] });

    const fetchArtists = async (ids: string[]) => {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 50) {
            chunks.push(ids.slice(i, i + 50));
        }

        const artistPromises = chunks.map(async (chunk) => {
            const res = await fetchFromSpotify(
                `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`
            );
            return res.artists;
        });

        const artists = await Promise.all(artistPromises);
        return artists.flat();
    };

    const artists = await fetchArtists(artistIds);

    const genreMap: { [key: string]: Set<string> } = {};
    artists.forEach((artist) => {
        artist.genres.forEach((genre: string | number) => {
            if (!genreMap[genre]) {
                genreMap[genre] = new Set();
            }
            songIdMap[artist.id].forEach((songId: string) =>
                genreMap[genre].add(songId)
            );
        });
    });

    let output = Object.entries(genreMap).map(([genre, songIds]) => ({
        genre,
        songIds: Array.from(songIds),
    }));

    output = output
        .sort((a, b) => b.songIds.length - a.songIds.length)
        .filter((a) => a.songIds.length >= 7);
    return output;
};

const getRandomUniqueSongs = async (
    n: number
): Promise<{ songId: string; songName: string; songGenre: string }[]> => {
    const playlistId = getPlaylistId();
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(track(id,name,artists(id)))`;
    const allSongs = await fetchAllItems(url, 100);

    const artistIds = allSongs.flatMap((song) =>
        song.track.artists.map((artist: { id: any }) => artist.id)
    );
    const songIdMap = allSongs.reduce((map, song) => {
        song.track.artists.forEach((artist: { id: string | number }) => {
            if (!map[artist.id]) {
                map[artist.id] = [];
            }
            map[artist.id].push({ id: song.track.id, name: song.track.name });
        });
        return map;
    }, {} as { [key: string]: { id: string; name: string }[] });

    const fetchArtists = async (ids: string[]) => {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 50) {
            chunks.push(ids.slice(i, i + 50));
        }

        const artistPromises = chunks.map(async (chunk) => {
            const res = await fetchFromSpotify(
                `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`
            );
            return res.artists;
        });

        const artists = await Promise.all(artistPromises);
        return artists.flat();
    };

    const artists = await fetchArtists(artistIds);

    const genreMap: { [key: string]: Set<{ id: string; name: string }> } = {};
    artists.forEach((artist) => {
        artist.genres.forEach((genre: string | number) => {
            if (!genreMap[genre]) {
                genreMap[genre] = new Set();
            }
            songIdMap[artist.id].forEach((song: { id: string; name: string }) =>
                genreMap[genre].add(song)
            );
        });
    });

    let output = Object.entries(genreMap).map(([genre, songs]) => ({
        genre,
        songs: Array.from(songs),
    }));

    output = output.sort((a, b) => a.songs.length - b.songs.length);

    const selectedSongs: {
        songId: string;
        songName: string;
        songGenre: string;
    }[] = [];
    const selectedSongIds = new Set<string>();

    while (selectedSongIds.size < n && output.length > 0) {
        const randomIndex = Math.floor(Math.random() * output.length);
        const genre = output[randomIndex];
        const randomSongIndex = Math.floor(Math.random() * genre.songs.length);
        const song = genre.songs[randomSongIndex];

        if (!selectedSongIds.has(song.id)) {
            selectedSongIds.add(song.id);
            selectedSongs.push({
                songId: song.id,
                songName: song.name,
                songGenre: genre.genre,
            });
        }

        genre.songs.splice(randomSongIndex, 1);

        if (genre.songs.length === 0) {
            output.splice(randomIndex, 1);
        }
    }

    return selectedSongs;
};

export {
    getGenres,
    getPlaylist,
    getPlaylistSongs,
    getPlaylistSongsAddedAt,
    getRandomUniqueSongs,
    getPlaylistSongsLength,
    getPlaylistSongsAddedBy,
};
