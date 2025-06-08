import React, { useState, useEffect } from 'react';
import { makeRequest } from "../utils";
import { RegisterEvent, RemoveEvent } from "../game";
import "./UsernameForHighScorePopup.css";

interface HighScoreSubmission {
    username: string;
    score: string;
}

interface UsernameForHighScorePopupProps {
    onUsernameSubmit?: (username: string) => void;
    children?: React.ReactNode;
}

/**
 * A component that shows a popup when the user gets a high score,
 * allowing them to enter their username for the leaderboard.
 */
export const UsernameForHighScorePopup: React.FC<UsernameForHighScorePopupProps> = ({ onUsernameSubmit, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [currentScore, setCurrentScore] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Listen for game over events
    useEffect(() => {
        const handleGameOver = (score: number) => {
            // Check if this is a high score
            const highScore = localStorage.getItem('highScore');
            const currentHighScore = highScore ? parseInt(highScore, 10) : 0;

            // Only show popup if this is a high score
            if (score > currentHighScore) {
                setCurrentScore(score);
                setIsVisible(true);
                setError(null);
                setSuccess(null);
                // Pre-populate with last used username if available
                const lastUsername = localStorage.getItem('lastUsername');
                if (lastUsername) {
                    setInputValue(lastUsername);
                }
            }
        };

        // Register event listener for game over events
        RegisterEvent<number>("gameOver", handleGameOver);

        // Cleanup event listener
        return () => {
            RemoveEvent<number>("gameOver", handleGameOver);
        };
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) {
            setError("Please enter a username");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Save username for next time
            localStorage.setItem('lastUsername', inputValue);

            // Submit score to the server
            const encodedScore = btoa(currentScore.toString());
            await makeRequest<HighScoreSubmission, void>('/api/leaderboard/addScore', {
                username: inputValue,
                score: encodedScore
            });

            // Update local storage with the new high score
            localStorage.setItem('highScore', currentScore.toString());

            setSuccess("Score submitted successfully!");
            setUsername(inputValue);

            // Call the onUsernameSubmit callback if provided
            if (onUsernameSubmit) {
                onUsernameSubmit(inputValue);
            }

            // Close popup after a short delay
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);
        } catch (err) {
            setError("Failed to submit your score. Please try again.");
            console.error("Error submitting score:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Return the component - only render if visible
    if (!isVisible) {
        return children;
    }

    return (
        <div className="username-popup-overlay">
            <div className="username-popup-container">
                <h2 className="username-popup-title">New High Score!</h2>
                <div className="username-popup-score">{currentScore}</div>

                <form className="username-popup-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="username-popup-input"
                        placeholder="Enter your username"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        maxLength={15}
                        required
                    />

                    <button
                        type="submit"
                        className="username-popup-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Score"}
                    </button>

                    {error && <div className="username-popup-error">{error}</div>}
                    {success && <div className="username-popup-success">{success}</div>}

                    <div className="username-popup-message">
                        Your name will appear on the leaderboard!
                    </div>
                </form>
            </div>
        </div>
    );
}