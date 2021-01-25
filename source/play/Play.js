import { useMemo, useEffect, useState, useCallback } from 'react';

import { PHASES } from '../shared/constants';
import { generateBoard } from './generateBoard';
import Board from './Board';
import SmallWordList from './SmallWordList';

import classes from './Play.module.css';

const Play = ({ seed, words, setWords, setPhase }) => {
  const letters = useMemo(() => generateBoard(seed.toUpperCase()), [seed]);

  const [time, setTime] = useState(180); // 180 seconds = 3 minutes
  const [boardAngle, setBoardAngle] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTime(time - 1);

      if (time === 0) setPhase(PHASES.REVIEW);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [time]);

  const handleQuit = useCallback(() => {
    setPhase(PHASES.SETUP);
  }, []);

  const handleRotate = useCallback(() => {
    setBoardAngle((angle) => angle - 90);
  }, []);

  return (
    <div className={classes.play}>
      <div className={classes.playHeader}>
        <span className="material-icons" onClick={handleQuit}>clear</span>
        <div className={classes.time}>
          {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </div>
        <span className="material-icons" onClick={handleRotate}>rotate_90_degrees_ccw</span>
      </div>

      <Board letters={letters} setWords={setWords} angle={boardAngle} />
      <SmallWordList words={words} />
    </div>
  );
};

export default Play;
