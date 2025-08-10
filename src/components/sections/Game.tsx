
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Gamepad2 } from 'lucide-react';

export function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedHighScore = localStorage.getItem('asteroid-dodger-highscore');
            if (storedHighScore) {
                setHighScore(parseInt(storedHighScore, 10));
            }
        }
    }, []);

    useEffect(() => {
        if (!isGameActive || isGameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Game objects
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 50,
            width: 30,
            height: 50,
            dx: 15,
        };

        let asteroids: { x: number; y: number; radius: number; dy: number }[] = [];
        let keys: { [key: string]: boolean } = {};
        let asteroidSpawnTimer = 0;
        
        const drawPlayer = () => {
            ctx.fillStyle = 'hsl(var(--primary))';
            // Simple triangle for the rocket
            ctx.beginPath();
            ctx.moveTo(player.x, player.y);
            ctx.lineTo(player.x - player.width / 2, player.y + player.height);
            ctx.lineTo(player.x + player.width / 2, player.y + player.height);
            ctx.closePath();
            ctx.fill();
        };

        const drawAsteroids = () => {
            asteroids.forEach(asteroid => {
                ctx.fillStyle = 'hsl(var(--muted-foreground))';
                ctx.beginPath();
                ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const updatePlayerPosition = () => {
            if ((keys['ArrowLeft'] || keys['a']) && player.x - player.width/2 > 0) {
                player.x -= player.dx;
            }
            if ((keys['ArrowRight'] || keys['d']) && player.x + player.width/2 < canvas.width) {
                player.x += player.dx;
            }
        };

        const updateAsteroids = () => {
            asteroidSpawnTimer++;
            if (asteroidSpawnTimer % 50 === 0) {
                const radius = Math.random() * 20 + 10;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const dy = Math.random() * 2 + 2;
                asteroids.push({ x, y: -radius, radius, dy });
            }

            asteroids.forEach((asteroid, index) => {
                asteroid.y += asteroid.dy;

                // Collision detection
                if (
                    player.x < asteroid.x + asteroid.radius &&
                    player.x + player.width > asteroid.x - asteroid.radius &&
                    player.y < asteroid.y + asteroid.radius &&
                    player.y + player.height > asteroid.y - asteroid.radius
                ) {
                    endGame();
                }

                if (asteroid.y - asteroid.radius > canvas.height) {
                    asteroids.splice(index, 1);
                    setScore(prev => prev + 1);
                }
            });
        };
        
        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawAsteroids();
            updatePlayerPosition();
            updateAsteroids();
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
        const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        gameLoop();
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };

    }, [isGameActive, isGameOver]);

    const startGame = () => {
        setScore(0);
        setIsGameOver(false);
        setIsGameActive(true);
    };

    const endGame = () => {
        setIsGameActive(false);
        setIsGameOver(true);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('asteroid-dodger-highscore', score.toString());
        }
    };

    return (
        <section id="game" className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Asteroid Dodger</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        A quick break from the challenges. Use your arrow keys to dodge the asteroids!
                    </p>
                </div>

                <Card className="max-w-2xl mx-auto bg-card shadow-2xl shadow-primary/10 border-primary/20 border p-4">
                    <CardHeader className='flex-row items-center justify-between'>
                        <div className="flex items-center gap-4">
                            <Gamepad2 className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className='font-headline text-2xl'>Score: {score}</CardTitle>
                                <CardDescription>High Score: {highScore}</CardDescription>
                            </div>
                        </div>
                         {!isGameActive && (
                            <Button onClick={startGame}>
                                {isGameOver ? 'Play Again' : 'Start Game'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <canvas 
                            ref={canvasRef} 
                            width={800} 
                            height={400}
                            className="w-full h-auto rounded-lg bg-background/50 border border-border"
                        />
                         {isGameOver && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <p className="text-4xl font-bold text-white font-headline">Game Over</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
