import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface PracticeTimerProps {
  initialMinutes?: number;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({ initialMinutes = 20 }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
    setIsActive(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
      <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
        <Clock className="w-3.5 h-3.5 text-neutral-500" />
        <span className="hidden sm:inline">Timer:</span>
      </div>
      <span className="font-mono text-xs font-semibold text-neutral-900 tracking-wider">
        {formattedTime}
      </span>
      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          onClick={toggleTimer}
          className="p-1 rounded bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 transition-colors"
          title={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="p-1 rounded bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
