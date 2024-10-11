import React, { useEffect, useState } from "react";
import PieChart from "../charts";
import { playSong } from "../../helpers/playerHelper";
import {
    CollaborationModel,
    getAverageSongLength,
    getMostPopularGenre,
    getOldestSong,
    getSomeSpecialSongs,
    Song,
} from "../../helpers/playlistHelper";

const SongRatio = () => {
    const [oldestSong, setOldestSong] = useState<Song | null>(null);
    const [averageSongLength, setAverageSongLength] = useState<string | null>(
        null
    );
    const [mostPopularGenre, setMostPopularGenre] = useState<{
        name: string;
        songs: number;
    } | null>(null);
    const [someSpecialSongs, setSomeSpecialSongs] = useState<string | null>(
        null
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    oldestSong,
                    averageSongLength,
                    mostPopularGenre,
                    someSpecialSongs,
                ] = await Promise.all([
                    getOldestSong(),
                    getAverageSongLength(),
                    getMostPopularGenre(),
                    getSomeSpecialSongs(5),
                ]);
                setOldestSong(oldestSong);
                setAverageSongLength(averageSongLength);
                setMostPopularGenre(mostPopularGenre);
                setSomeSpecialSongs(someSpecialSongs);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    const information = [
        {
            title: "Most heard Genre",
            value: mostPopularGenre
                ? `${mostPopularGenre.name} (${mostPopularGenre.songs} songs)`
                : "Loading...",
        },
        {
            title: "Average Song Length",
            value: averageSongLength || "Loading...",
        },
        {
            title: "Oldest Song",
            value: oldestSong
                ? `${new Date(oldestSong.added_at).toLocaleDateString(
                      "de-DE"
                  )}: ${oldestSong.name} - ${oldestSong.artists.join(", ")}`
                : "Loading...",
            valueClass: "canPlay",
            href: oldestSong ? `spotify:track:${oldestSong.id}` : "",
        },
    ];

    return (
        <div className="pieChart-wrapper">
            <div>
                <h2>Song Ratio</h2>
                <div className="pieChart-wrapper__pie">
                    <PieChart />
                </div>
            </div>
            <div>
                <h2>Information</h2>
                <div className="pieChart-wrapper__additional">
                    <div className="list">
                        {information.map((info, index) => (
                            <span key={index} className="information-line">
                                <p>{info.title}: </p>
                                <span className="value">
                                    <b
                                        onClick={
                                            info.href
                                                ? () => playSong(info.href)
                                                : undefined
                                        }
                                        className={info.valueClass || ""}
                                    >
                                        {info.value}
                                    </b>
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongRatio;
