"use client";

import React, { useState, useEffect } from "react";

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
  const [isEventOver, setIsEventOver] = useState(false);

  useEffect(() => {
    // Set a date in the past to signify the event is over.
    const eventEndDate = new Date("2024-08-24T18:00:00+05:30");
    setTargetDate(eventEndDate);
    if (+new Date() > +eventEndDate) {
      setIsEventOver(true);
    }
  }, []);

  useEffect(() => {
    if (!targetDate || isEventOver) return;

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        setIsEventOver(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate, timeLeft, isEventOver]);

  if (isEventOver) {
    return (
      <div className="my-8">
        <span className="text-2xl md:text-3xl font-headline text-primary">
          The event has concluded. See you next year!
        </span>
      </div>
    );
  }
  
  if (!targetDate) {
    return (
      <div className="flex justify-center gap-4 md:gap-8 my-8">
        {["days", "hours", "minutes", "seconds"].map((interval) => (
          <div key={interval} className="flex flex-col items-center">
            <span className="font-headline text-4xl md:text-6xl font-bold text-primary">
              00
            </span>
            <span className="text-sm uppercase text-muted-foreground">
              {interval}
            </span>
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
            <span className="font-headline text-4xl md:text-6xl font-bold text-primary">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-sm uppercase text-muted-foreground">
              {interval}
            </span>
          </div>
        ))
      ) : (
         <div className="my-8">
            <span className="text-2xl md:text-3xl font-headline text-primary">
              The event has concluded. See you next year!
            </span>
        </div>
      )}
    </div>
  );
}
