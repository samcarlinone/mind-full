import { useMemo, useEffect, useState, useCallback } from 'react';

import { generateBoard } from './generateBoard';
import Board from './Board';
import SmallWordList from './SmallWordList';

import classes from './Play.module.css';
import {ACTIONS} from '../shared/reducer';

const Play = ({ state, dispatch }) => {
  const {seed, words} = state;

  const letters = useMemo(() => generateBoard(seed.toUpperCase()), [seed]);

  const [time, setTime] = useState(180); // 180 seconds = 3 minutes
  const [boardAngle, setBoardAngle] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTime(time - 1);

      if (time === 0) {
        dispatch(ACTIONS.END_GAME);
      }
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [time]);

  const handleQuit = useCallback(() => dispatch(ACTIONS.RESTART_GAME), []);

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

      <Board dispatch={dispatch} letters={letters} angle={boardAngle} />
      <SmallWordList words={words} />
    </div>
  );
};

export default Play;
