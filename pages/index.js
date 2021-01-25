import { useCallback, useEffect, useState } from 'react';

import { PHASES } from '../source/shared/constants';
import Setup from '../source/setup/Setup';
import Play from '../source/play/Play';
import Review from '../source/review/Review';


const Index = () => {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [group, setGroup] = useState(false);
  const [seed, setSeed] = useState('');
  const [words, setWords] = useState([]);

  const handleResize = useCallback(
    () => document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`),
    [],
  );

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  if (phase === PHASES.SETUP)
    return <Setup seed={seed} setSeed={setSeed} setPhase={setPhase} group={group} setGroup={setGroup} />;

  if (phase === PHASES.PLAY)
    return <Play group={group} seed={seed} words={words} setWords={setWords} setPhase={setPhase} />;

  if (phase === PHASES.REVIEW)
    return <Review words={words} setWords={setWords} setPhase={setPhase} />;

  return <div>Error</div>;
};

export default Index;
