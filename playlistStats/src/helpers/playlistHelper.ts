import {
    getGenres,
    getPlaylistSongsAddedAt,
    getPlaylistSongsAddedBy,
    getPlaylistSongsLength,
    getRandomUniqueSongs,
} from "./api/playlistHelper";

export type Song = {
    added_at: any;
    name: any;
    id: any;
    artists: any;
};

export type CollaborationModel = {
    value: number;
    name: string;
};

const getMostPopularGenre = async (): Promise<any> => {
    const genres = (await getGenres())
        .sort((a, b) => b.songIds.length - a.songIds.length)
        .map((genre) => ({ name: genre.genre, songs: genre.songIds.length }));
    console.log(genres[0]);
    return genres[0];
};

const getSomeSpecialSongs = async (n: number): Promise<any> => {
    const songs = await getRandomUniqueSongs(n);
    console.log(songs);
    return songs;
};

const getCollaborators = async (): Promise<CollaborationModel[]> => {
    const allCollaborators = await Promise.resolve(getPlaylistSongsAddedBy());
    return allCollaborators;
};

const getOldestSong = async (): Promise<Song> => {
    const songs = await getPlaylistSongsAddedAt();
    const songsParsed = songs.map((song: any) => ({
        added_at: song.added_at,
        name: song.track.name,
        id: song.track.id,
        artists: song.track.artists.map((artist: any) => {
            return artist.name;
        }),
    }));

    const oldestSong = songsParsed.reduce((oldest, song) => {
        return new Date(song.added_at) < new Date(oldest.added_at)
            ? song
            : oldest;
    }, songsParsed[0]);
    return oldestSong;
};

const getAverageSongLength = async (): Promise<string> => {
    const songs = await getPlaylistSongsLength();
    let totalLength: number = 0;
    songs.forEach((song: any) => {
        totalLength += song.track.duration_ms;
    });
    const averageLength = totalLength / songs.length;

    return msToMinutesAndSeconds(averageLength);
};

const getGenre = async (): Promise<any> => {};

export {
    getOldestSong,
    getGenre,
    getAverageSongLength,
    getCollaborators,
    getMostPopularGenre,
    getSomeSpecialSongs,
};

function msToMinutesAndSeconds(ms: number): string {
    const minutes = Math.floor(ms / 60000); // Get total minutes
    const seconds = Math.floor((ms % 60000) / 1000); // Get remaining seconds
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Ensure two-digit seconds
}
