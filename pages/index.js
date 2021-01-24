import { useState } from 'react';

import { PHASES } from '../source/shared/constants';
import Setup from '../source/setup/Setup';
import Play from '../source/play/Play';
import Review from '../source/review/Review';


const Index = () => {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [seed, setSeed] = useState('');
  const [words, setWords] = useState([]);

  if (phase === PHASES.SETUP)
    return <Setup seed={seed} setSeed={setSeed} setPhase={setPhase} />;

  if (phase === PHASES.PLAY)
    return <Play seed={seed} words={words} setWords={setWords} setPhase={setPhase} />;

  if (phase === PHASES.REVIEW)
    return <Review words={words} setWords={setWords} setPhase={setPhase} />;

  return <div>Error</div>;
};

export default Index;
