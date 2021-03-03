import { useCallback } from 'react';
import clsx from 'clsx';

import Brain from './Brain';

import classes from './Setup.module.css';
import {ACTIONS} from '../shared/reducer';

const Setup = ({ state, dispatch }) => {
  const handleSeedChange = useCallback((e) => dispatch(ACTIONS.SET_SEED, e.target.value), []);
  const handleToggleGroup = useCallback(() => dispatch(ACTIONS.TOGGLE_GROUP), []);

  const handleStartGame = useCallback(() => dispatch(ACTIONS.START_GAME), []);
  const handleReviewLast = useCallback(() => dispatch(ACTIONS.REVIEW_LAST), []);

  const {group, seed} = state;

  return (
    <div className={classes.setup}>
      <div className={classes.name}>
        <div>Mind-</div>
        <div>
          Full
          <Brain className={classes.brain} />
        </div>
      </div>
      <div className={classes.groupToggle} onClick={handleToggleGroup}>
        <span className={clsx('material-icons', {[classes.activeMode]: !group})}>
          person
        </span>
        <div className={classes.toggleIndicator}>
          <span className={clsx('material-icons', {[classes.active]: group})}>arrow_left</span>
        </div>
        <span className={clsx('material-icons', {[classes.activeMode]: group})}>
          groups
        </span>
      </div>
      <div className={classes.inputs}>
        <div className={clsx(classes.inputContainer, {[classes.active]: group})}>
          <input type="text" name="seed" placeholder="SEED" value={seed} onChange={handleSeedChange} />
        </div>
        <button onClick={handleStartGame}>
          Start
        </button>
      </div>
      <div className={clsx(classes.explainer, {[classes.active]: group})}>
        Just have everyone type the same <i>SEED</i> and everyone will get the same board.
      </div>
      <div className={classes.actionIcons}>
        <span
          className={clsx('material-icons', classes.actionIcon)}
          onClick={handleReviewLast}
        >
          restore
        </span>
      </div>
    </div>
  );
};

export default Setup;
