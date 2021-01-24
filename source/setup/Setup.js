import { useCallback } from 'react';

import Brain from './Brain';
import { PHASES } from '../shared/constants';

import classes from './Setup.module.css';

const Setup = ({ setPhase, seed, setSeed }) => {
  const onChange = useCallback((e) => setSeed(e.target.value), []);
  const startGame = useCallback(() => setPhase(PHASES.PLAY), []);

  return (
    <div className={classes.setup}>
      <div className={classes.name}>
        <div>Mind-</div>
        <div>
          Full
          <Brain className={classes.brain} />
        </div>
      </div>
      <div className={classes.inputs}>
        <input type="text" name="seed" placeholder="BOARD CODE" value={seed} onChange={onChange} />
        <button onClick={startGame}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Setup;
