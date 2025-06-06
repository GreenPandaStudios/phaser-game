import { useEffect, useState } from "react";
import { RegisterEvent, RemoveEvent } from "../game";

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
        <div className="score-container" style={{
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '15px',
            borderRadius: '8px',
            color: '#00FF00', // Arcade green
            fontFamily: '"Press Start 2P", Courier, monospace', // Retro game font
            boxShadow: '0 0 10px #00FF00', // Neon glow effect
            margin: '10px',
            textAlign: 'center',
            border: '2px solid #00FF00',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            animation: isShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
            transform: 'translate3d(0, 0, 0)',
            perspective: '1000px'
        }}>
            <style>
                {`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes droop {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(-10deg); }
                    100% { transform: rotate(0deg); }
                }
                `}
            </style>

            <div style={{
                borderTop: '1px dashed #00FF00',
                paddingTop: '5px'
            }}>
                HIGH SCORE: <span style={{
                    fontWeight: 'bold',
                    color: '#FFFF00', // Yellow for high score
                    fontSize: '1.2em'
                }}>{highScore}</span>
            </div>
            {children}
            <div style={{
                fontSize: '0.8em',
                marginBottom: '5px',
                animation: isDrooping ? 'droop 1s ease' : 'none',
                display: 'inline-block'
            }}>
                CURRENT SCORE: <span style={{
                    fontSize: `${1.2 + (currentScore * 0.25)}em`,
                    transition: 'font-size 0.3s ease'
                }}>{currentScore}</span>
            </div>
        </div>
    );
};
