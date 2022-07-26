import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import {isAdjacent} from '../shared/isAdjacent';

import classes from './Board.module.css';
import {ACTIONS} from '../shared/reducer';
import {SHORT_VIBRATION} from '../shared/constants';

const QU_CHAR = '1';

const Board = ({ dispatch, wordInProgressRef, letters, angle, setAngle }) => {
  const [pointerActive, setPointerActive] = useState(false);
  const [touchIndices, setTouchIndexes] = useState([]);
  const [keyboardWord, setKeyboardWord] = useState('');

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
    setKeyboardWord('');

    setPointerActive(true);
    wordInProgressRef.current = true;
  })

  const pointerMove = useCallback((e) => {
    if (!pointerActive) return;

    setKeyboardWord('');

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
    setKeyboardWord('');

    dispatch(ACTIONS.ADD_WORD, mapIndexesToWord());
    
    setPointerActive(false);
    wordInProgressRef.current = false;

    setTouchIndexes([]);
  });

  // Keyboard word validation
  const toQuChar = (letter) => letter === 'Qu' ? QU_CHAR : letter;

  const keyboardChains = useMemo(() => {
    let chains = [];

    letters.map((l, i) => {
      if (toQuChar(l) === keyboardWord[0]) chains.push([i]);
    });
  
    [...keyboardWord.slice(1)].forEach((letter) => {
      let newChains = [];

      const indexes = letters
        .map((l, i) => toQuChar(l) === letter ? i : undefined)
        .filter((i) => i !== undefined);

      chains.forEach((chain) => {
        indexes.forEach((index) => {
          if (isAdjacent(chain.slice(-1)[0], index) && !chain.includes(index))
            newChains.push([...chain, index]);
        })
      })

      chains = newChains;
    });

    return chains;
  }, [keyboardWord]);
  
  const lastIndexes = useMemo(() => keyboardChains.map((chain) => chain.slice(-1)[0]), [keyboardWord]);

  // Global key press listener
  const keyDown = useCallback((e) => {
    setTouchIndexes([]);

    if (e.key === 'ArrowRight') setAngle((angle) => angle + 90);
    if (e.key === 'ArrowLeft') setAngle((angle) => angle - 90);

    if (e.key === 'Control' || e.key === ' ') setKeyboardWord('');

    if (e.key === 'Backspace') setKeyboardWord(keyboardWord.slice(0, -1));

    if (e.key === 'Enter') {
      if (keyboardWord.length < 3 || keyboardChains.length === 0) return;

      dispatch(ACTIONS.ADD_WORD, keyboardWord.replace(RegExp(QU_CHAR, 'g'), 'QU'));
      setKeyboardWord('');
    }

    if (/^[A-Z]$/.test(e.key.toUpperCase())) {
      const newWord = e.key.toUpperCase() === 'Q'
        ? keyboardWord + QU_CHAR
        : keyboardWord + e.key.toUpperCase();

      setKeyboardWord(newWord);
    }
  });

  useEffect(() => {
    const handler = keyDown;
    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [keyboardWord]);

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

          const isLastCell = lastIndexes.includes(i);
          const isPathCell = !isLastCell && keyboardChains.some((chain) => chain.includes(i));
          
          return (
            <div
              key={i}
              data-index={i}
              style={style}
              className={clsx(classes.cell, {
                [classes.usedCell]: isTouched,
                [classes.lastCell]: isLastCell,
                [classes.pathCell]: isPathCell,
                [classes.quCell]: letter === 'Qu',
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
      <div className={clsx(classes.word, {
        [classes.errorWord]: keyboardWord.length > 0 && keyboardChains.length === 0,
      })}>
        {keyboardWord.length > 0
          ? keyboardWord.replace(RegExp(QU_CHAR, 'g'), 'QU')
          : mapIndexesToWord()}
      </div>
    </>
  );
};

export default Board;
