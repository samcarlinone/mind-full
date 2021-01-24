import { useMemo, useCallback, useState } from 'react';
import clsx from 'clsx';

import { PHASES } from '../shared/constants';
import { scoreWord } from '../shared/scoreWord';

import classes from './Review.module.css';

const Review = ({ words, setWords, setPhase }) => {
  const sortedWords = useMemo(() =>
    [...words].sort((a, b) => a.localeCompare(b))
  );
  const [wordData, setWordData] = useState(
    sortedWords.map((word) => ({ word, crossed: false }))
  );

  const restartGame = useCallback(() => {
    setPhase(PHASES.SETUP);
    setWords([]);
  });

  const toggleWord = useCallback((index) => {
    const newData = [...wordData];
    newData[index].crossed = !newData[index].crossed;

    setWordData(newData);
  });

  return (
    <div className={classes.review}>
      <div className={classes.reviewWordList}>
        {wordData.map(({ word, crossed }, index) => (
          <span
            key={word}
            className={clsx({ [classes.crossed]: crossed })}
            onClick={() => toggleWord(index)}
          >
            {word}
          </span>
        ))}
      </div>
      <div className={classes.score}>
        {wordData
          .filter(({ crossed }) => !crossed)
          .map(scoreWord)
          .reduce((t, s) => t + s, 0)}
      </div>
      <button className={classes.restartButton} onClick={restartGame}>
        Restart
      </button>
    </div>
  );
};

export default Review;
