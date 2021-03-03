import { useCallback, useEffect, useReducer } from 'react';

import { PHASES } from '../source/shared/constants';
import { INITIAL_STATE, reducer } from '../source/shared/reducer';
import Setup from '../source/setup/Setup';
import Play from '../source/play/Play';
import Review from '../source/review/Review';
import produce from 'immer';

const Index = () => {
  const [state, hookDispatch] = useReducer(
    (state, action) => produce(state, draft => reducer[action.type](draft, action)),
    INITIAL_STATE,
  );

  const dispatch = useCallback((type, payload) => hookDispatch({type, payload}), []);

  const handleResize = useCallback(
    () => document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`),
    [],
  );

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  if (state.phase === PHASES.SETUP)
    return <Setup state={state} dispatch={dispatch} />;

  if (state.phase === PHASES.PLAY)
    return <Play state={state} dispatch={dispatch} />;

  if (state.phase === PHASES.REVIEW)
    return <Review state={state} dispatch={dispatch} />;

  return <div>Error</div>;
};

export default Index;
