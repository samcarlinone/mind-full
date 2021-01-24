import { useMemo, useEffect, useState } from 'react';

import { PHASES } from '../shared/constants';
import { generateBoard } from './generateBoard';
import Board from './Board';
import SmallWordList from './SmallWordList';

import classes from './Play.module.css';

const Play = ({ seed, words, setWords, setPhase }) => {
  const letters = useMemo(() => generateBoard(seed.toUpperCase()), [seed]);

  const [time, setTime] = useState(180); // 180 seconds = 3 minutes

  useEffect(() => {
    window.setTimeout(() => {
      setTime(time - 1);

      if (time === 0) setPhase(PHASES.REVIEW);
    }, 1000);
  }, [time]);

  return (
    <div className={classes.play}>
      <div className={classes.playHeader}>
        <div className={classes.time}>
          {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <Board letters={letters} setWords={setWords} />
      <SmallWordList words={words} />
    </div>
  );
};

export default Play;
