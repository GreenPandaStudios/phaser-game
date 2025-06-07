import { useEffect, useState } from "react";
import { RegisterEvent, RemoveEvent } from "../game";
import "./ScoreKeeper.css";

interface IProps {
    children?: React.ReactNode;
}

export const ScoreKeeper = ({ children }: IProps) => {
    const [currentScore, setCurrentScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const savedScore = localStorage.getItem('highScore');
        return savedScore ? parseInt(savedScore, 10) : 0;
    });

    // Animation states
    const [isShaking, setIsShaking] = useState(false);
    const [isDrooping, setIsDrooping] = useState(false);

    // Update localStorage when high score changes
    useEffect(() => {
        localStorage.setItem('highScore', highScore.toString());
    }, [highScore]);

    useEffect(() => {
        const handleBallHitGround = (count: number) => {
            setIsDrooping(currentScore !== 0);
            setCurrentScore(0);
            if (count > highScore) {
                setHighScore(count);
            }
            setTimeout(() => setIsDrooping(false), 1000);
        };

        const handleScoreUpdate = (count: number) => {
            setCurrentScore(count);
            if (count > highScore) {
                setHighScore(count);
            }
        };

        RegisterEvent("gameOver", handleBallHitGround);
        RegisterEvent("scored", handleScoreUpdate);
        return () => {
            RemoveEvent("gameOver", handleBallHitGround);
            RemoveEvent("scored", handleScoreUpdate);
        }
    }, [highScore, setHighScore, setCurrentScore]);

    useEffect(() => {
        if (currentScore > 0) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }, [currentScore]);

    return (
        <>
            <div className={`mobile-score-section ${isDrooping ? 'drooping' : ''}`}>
                CURRENT SCORE: <span
                    className="current-score"
                    style={{
                        fontSize: `${1.2 + (currentScore * 0.05)}em`
                    }}
                >
                    {currentScore}
                </span>
            </div>
            <div className={`score-container ${isShaking ? 'shaking' : ''}`}>
                <div className="high-score-section">
                    HIGH SCORE: <span className="high-score">{highScore}</span>
                </div>
                {children}
                <div className={`current-score-section ${isDrooping ? 'drooping' : ''}`}>
                    CURRENT SCORE: <span
                        className="current-score"
                        style={{
                            fontSize: `${1.2 + (currentScore * 0.25)}em`
                        }}
                    >
                        {currentScore}
                    </span>
                </div>
            </div>
        </>
    );
};
