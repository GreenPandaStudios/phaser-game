import React from "react";
import { useRequest, makeRequest } from "../utils";
import "./Leaderboard.css"; // Import the CSS file

export interface LeaderboardEntry {
    username: string;
    score: number;
    id?: string; // Optional ID for the entry
}

export const LeaderBoard: React.FC<{ isApprovalQueue: boolean }> = ({ isApprovalQueue }) => {
    const { data, error, loading, request } = useRequest<undefined, LeaderboardEntry[]>();


    React.useEffect(() => {
        if (!isApprovalQueue) {
            request("/api/leaderboard", undefined);
        }
        else {
            request("/api/admin/approvals", undefined);
        }
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
                {data?.map((entry, index) => {

                    return (
                        <li key={entry.username} className="leaderboard-item">
                            <span className="leaderboard-rank">#{index + 1}</span>
                            <span className="leaderboard-username">{entry.username}</span>
                            <span className="leaderboard-score">{entry.score}</span>
                            {isApprovalQueue && <>
                                <button
                                    className="leaderboard-approve-button"
                                    onClick={() => {
                                        makeRequest(`/api/admin/approve`, { id: entry.id });
                                    }}
                                >
                                    approve
                                </button>
                                <button
                                    className="leaderboard-reject-button"
                                    onClick={() => {
                                        makeRequest(`/api/admin/reject`, { id: entry.id });
                                    }}
                                >
                                    reject
                                </button>

                            </>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}


