import { useCallback, useState } from 'react';
import clsx from 'clsx';

import Brain from './Brain';
import { PHASES } from '../shared/constants';

import classes from './Setup.module.css';

const Setup = ({ setPhase, seed, setSeed, group, setGroup }) => {
  const onChange = useCallback((e) => setSeed(e.target.value), []);
  const startGame = useCallback(() => setPhase(PHASES.PLAY), []);

  const handleToggleGroup = useCallback(() => setGroup((isGroupGame) => !isGroupGame), []);

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
          <input type="text" name="seed" placeholder="SEED" value={seed} onChange={onChange} />
        </div>
        <button onClick={startGame}>
          Start
        </button>
      </div>
      <div className={clsx(classes.explainer, {[classes.active]: group})}>
        Just have everyone type the same <i>SEED</i> and everyone will get the same board.
      </div>
    </div>
  );
};

export default Setup;
