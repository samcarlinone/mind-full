import { useState, useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import classes from './Board.module.css';

const SIZE = 4

const indexDistance = (index1, index2) =>
  Math.sqrt(
    (index1 % SIZE - index2 % SIZE) ** 2 +
    (Math.floor(index1 / SIZE) - Math.floor(index2 / SIZE)) ** 2
  );

const Board = ({ letters, setWords, angle }) => {
  const [pointerActive, setPointerActive] = useState(false);
  const [touchIndices, setTouchIndexes] = useState([]);

  const mapIndexesToWord = () =>
    touchIndices
      .map((index) => letters[index])
      .join("")
      .toUpperCase();

  // Stop Simulated Clicking (React Bug Requires Ref Usage)
  // https://github.com/facebook/react/issues/8968
  const boardRef = useRef();
  const touchStart = useCallback((e) => {
    e.preventDefault();
  });

  useEffect(() => {
    const boardEl = boardRef.current;

    boardEl.addEventListener("touchstart", touchStart, {
      passive: false
    });

    return () => boardEl.removeEventListener("touchstart", touchStart);
  }, []);

  // Handle Interaction
  const pointerDown = useCallback(() => {
    setPointerActive(true);
  })

  const SHORT_VIBRATION = 35;
  const LONG_VIBRATION = [0, 50, 150];

  const pointerMove = useCallback((e) => {
    if (!pointerActive) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);

    if (!element) return;

    const index = +element.dataset.index;
    const letterPosition = touchIndices.indexOf(index);

    if (letterPosition !== -1) {
      if (letterPosition !== touchIndices.length - 1) {
        setTouchIndexes(touchIndices.slice(0, letterPosition + 1));
        if (window.navigator.vibrate) window.navigator.vibrate(SHORT_VIBRATION);
      }

      return;
    }
    
    const currentLastIndex = touchIndices[touchIndices.length - 1];
    const isAdjacent = indexDistance(currentLastIndex, index) < 1.5;
    
    if (isNaN(index) || (touchIndices.length > 0 && !isAdjacent)) return;

    setTouchIndexes([...touchIndices, index]);
    if (window.navigator.vibrate) window.navigator.vibrate(SHORT_VIBRATION);
  })

  const pointerUp = useCallback(() => {
    setWords((words) => {
      const word = mapIndexesToWord();

      if (word.length < 3 || words.includes(word)) return words;
      else {
        if (window.navigator.vibrate) window.navigator.vibrate(LONG_VIBRATION);
        return [word, ...words];
      }
    });

    setPointerActive(false);
    setTouchIndexes([]);
  });

  return (
    <>
      <div
        className={classes.board}
        ref={boardRef}
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        style={{'--angle': `${angle}deg`}}
      >
        {letters.map((letter, i) => {
          const touchIndex = touchIndices.indexOf(i);
          const isTouched = touchIndex !== -1;

          const nextDirection = {'1': 0, '5': 45, '4': 90, '3': 135, '-1': 180, '-5': 225, '-4': 270, '-3': 315}[touchIndices[touchIndex + 1] - touchIndices[touchIndex]];
          
          const style = {
            '--next-angle': `${nextDirection}deg`,
            '--offset-distance': nextDirection % 10 === 0 ? '1' : Math.SQRT2.toString(),
          };
          
          return (
            <div
              key={i}
              data-index={i}
              style={style}
              className={clsx(classes.cell, {
                [classes.usedCell]: isTouched
              })}
              onPointerMove={pointerMove}
            >
              <span>{letter}</span>
              {isTouched && touchIndex < touchIndices.length - 1
                ? <div className={classes.connector} style={style} />
                : null}
            </div>
          )
        })}
      </div>
      <div className={classes.word}>{mapIndexesToWord()}</div>
    </>
  );
};

export default Board;
