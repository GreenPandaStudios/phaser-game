import React from "react";
import { useRequest } from "../utils";
import "./Leaderboard.css"; // Import the CSS file

export interface LeaderboardEntry {
    username: string;
    score: number;
}

export const LeaderBoard: React.FC = () => {
    const { data, error, loading, request } = useRequest<undefined, LeaderboardEntry[]>();


    React.useEffect(() => {
        request("/api/leaderboard", undefined);
    }, []);


    if (loading) {
        return <div className="leaderboard-container loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="leaderboard-container error-message">Error: {error}</div>;
    }

    return (

        <div className="leaderboard-container">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <ul className="leaderboard-list">
                {data?.map((entry, index) => (
                    <li key={entry.username} className="leaderboard-item">
                        <span className="leaderboard-rank">#{index + 1}</span>
                        <span className="leaderboard-username">{entry.username}</span>
                        <span className="leaderboard-score">{entry.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}