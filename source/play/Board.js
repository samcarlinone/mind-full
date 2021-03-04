import { useState, useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import {isAdjacent} from '../shared/isAdjacent';

import classes from './Board.module.css';
import {ACTIONS} from '../shared/reducer';
import {SHORT_VIBRATION} from '../shared/constants';

const Board = ({ dispatch, wordInProgressRef, letters, angle }) => {
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
    wordInProgressRef.current = true;
  })

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
    
    if (isNaN(index) || (touchIndices.length > 0 && !isAdjacent(currentLastIndex, index))) return;

    setTouchIndexes([...touchIndices, index]);
    if (window.navigator.vibrate) window.navigator.vibrate(SHORT_VIBRATION);
  })

  const pointerUp = useCallback(() => {
    dispatch(ACTIONS.ADD_WORD, mapIndexesToWord());
    
    setPointerActive(false);
    wordInProgressRef.current = false;

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
