import { useEffect, useState } from "react";
import { RegisterEvent, RemoveEvent } from "../game";
import "./ScoreKeeper.css";
import { Link } from "react-router-dom";

interface IProps {
    children?: React.ReactNode;
}

export const ScoreKeeper = ({ children }: IProps) => {
    const [currentScore, setCurrentScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [highScore, setHighScore] = useState(() => {
        const savedScore = localStorage.getItem('highScore');
        return savedScore ? parseInt(savedScore, 10) : 0;
    });

    // Animation states
    const [isShaking, setIsShaking] = useState(false);
    const [isDrooping, setIsDrooping] = useState(false);
    const [wasHardHit, setWasHardHit] = useState(false);

    // Update localStorage when high score changes
    useEffect(() => {
        localStorage.setItem('highScore', highScore.toString());
    }, [highScore]);

    useEffect(() => {
        const handleBallHitGround = (count: number) => {
            setIsDrooping(currentScore !== 0);
            setCurrentScore(0);
            setMultiplier(1);
            if (count > highScore) {
                setHighScore(count);
            }
            setTimeout(() => setIsDrooping(false), 1000);
        };

        const handleScoreUpdate = (data: {
            score: number,
            multiplier: number
        }) => {
            setCurrentScore(data.score);
            setMultiplier(data.multiplier);
            if (data.score > highScore) {
                setHighScore(data.score);
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

    useEffect(() => {
        if (multiplier > 1) {
            setWasHardHit(true);
            const timer = setTimeout(() => setWasHardHit(false), 500);
            return () => clearTimeout(timer);
        }
    }, [multiplier]);

    return (
        <>

            <div className={`score-container ${isShaking ? 'shaking' : ''}`}>
                <div className={`current-score-section ${isDrooping ? 'drooping' : ''}`}>
                    CURRENT SCORE: <span
                        className="current-score"

                    >
                        {currentScore}
                    </span>

                </div>
                <div className="high-score-section">
                    HIGH SCORE: <span className="high-score">{highScore}</span>
                </div>



                {children}
                <div className={`multiplier-section ${wasHardHit ? 'hard-hit' : ''}`}>
                    <span className="multiplier"
                        style={
                            {
                                fontSize: `${1.2 + (multiplier * 1)}em`,
                                color: multiplier == 1 ? 'white' : multiplier == 2 ? 'yellow' : multiplier == 3 ? 'orange' : multiplier == 4 ? 'red' : 'purple',
                                textShadow: multiplier > 1 ? '0 0 10px gold' : 'none'
                            }}
                    > {multiplier}x</span>
                </div>

            </div >
        </>
    );
};
