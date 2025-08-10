"use client";

import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft: { [key: string]: number } = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export function Countdown() {
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
    
    useEffect(() => {
      // Set target date only on the client to avoid hydration mismatch
      setTargetDate(new Date('2025-10-10T09:00:00'));
    }, []);

    useEffect(() => {
      if (!targetDate) return;

      const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft(targetDate));
      }, 1000);

      return () => clearTimeout(timer);
    });

    if (!targetDate) {
      return (
        <div className="flex justify-center gap-4 md:gap-8 my-8">
          {[ 'days', 'hours', 'minutes', 'seconds' ].map((interval) => (
             <div key={interval} className="flex flex-col items-center">
                <span className="font-headline text-4xl md:text-6xl font-bold text-primary">00</span>
                <span className="text-sm uppercase text-muted-foreground">{interval}</span>
            </div>
          ))}
        </div>
      );
    }

    const timerComponents = Object.entries(timeLeft);

    return (
        <div className="flex justify-center gap-4 md:gap-8 my-8">
            {timerComponents.length ? (
              timerComponents.map(([interval, value]) => (
                <div key={interval} className="flex flex-col items-center">
                    <span className="font-headline text-4xl md:text-6xl font-bold text-primary">{String(value).padStart(2, '0')}</span>
                    <span className="text-sm uppercase text-muted-foreground">{interval}</span>
                </div>
              ))
            ) : (
              <span className="text-2xl font-headline text-primary">The event has begun!</span>
            )}
        </div>
    );
}
