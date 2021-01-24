import classes from './SmallWordList.module.css';

const SmallWordList = ({ words }) => {
  if (words.length === 0)
    return <div className={classes.noWords}>No Words Yet</div>;

  return (
    <div className={classes.wordList}>
      {words.map((word) => (
        <span key={word}>{word}</span>
      ))}
    </div>
  );
};

export default SmallWordList;
