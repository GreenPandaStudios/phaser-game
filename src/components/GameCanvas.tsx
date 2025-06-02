
import React from 'react';
import { createGame } from '../game';


interface IProps {
    width?: number;
    height?: number;
    id?: string;
}
export const GameCanvas: React.FC<IProps> = ({ width = 800, height = 600, id = "gameCanvas" }) => {
    React.useEffect(() => {
        const canvas = document.getElementById(id) as HTMLCanvasElement;
        if (canvas) {
            createGame(canvas);
        }
    }, [id]);

    return (
        <canvas
            id={id}
            width={width}
            height={height}
            style={{ width: `${width}px`, height: `${height}px`, border: '1px solid black' }}
        />
    );
};