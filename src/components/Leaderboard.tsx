import React from "react";
import { useRequest, makeRequest } from "../utils";
import "./Leaderboard.css"; // Import the CSS file
import { Link } from "react-router-dom";

export interface LeaderboardEntry {
    username: string;
    score: number;
}

export const LeaderBoard: React.FC = () => {
    const { data, error, loading, request } = useRequest<null, LeaderboardEntry[]>();
    const [enteringUsername, setEnteringUsername] = React.useState<boolean>();
    const [username, setUsername] = React.useState<string>("");

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const newHighScore = params.get('newHighScore');
        if (newHighScore) {
            setEnteringUsername(newHighScore === "true");
        }
    }, []);

    React.useEffect(() => {
        request("/api/leaderboard", null);
    }, []);


    if (enteringUsername) {
        return (
            <div className="leaderboard-container">
                <h2 className="leaderboard-title">Enter Your Username</h2>
                <form
                    className="username-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (username.trim()) {
                            makeRequest("/api/leaderboard/addscore", { username });
                            setEnteringUsername(false);
                        }
                    }}
                >
                    <input
                        type="text"
                        className="username-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        );
    }

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