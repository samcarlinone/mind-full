words = ['ease', 'noes', 'nose', 'not', 'note', 'notes', 'nots', 'sate', 'saw', 'sea', 'season', 'son', 'sow', 'sown', 'taste', 'test', 'toe', 'toes', 'ton', 'toss', 'tote', 'totes', 'was', 'waste', 'watt', 'watts', 'wet', 'woe', 'woes', 'won']

board = [
  't', 'e', 's', 'e',
  'w', 'o', 's', 'a',
  'n', 't', 't', 'w',
  'v', 'qu', 'e', 't',
]

const DIRECTIONS = {
  NW: {index: 0, offset: -5},
   N: {index: 1, offset: -4},
  NE: {index: 2, offset: -3},
   E: {index: 3, offset: +1},
  SE: {index: 4, offset: +5},
   S: {index: 5, offset: +4},
  SW: {index: 6, offset: +3},
   W: {index: 7, offset: -1},
};

const generateBoardLookup = (board) => board.reduce((map, currentLetter, index) => {
  map[currentLetter] = [...(map[currentLetter] ?? []), index];
  return map;
}, {});

// const generatePaths = (word, lookup) => {
//   let
// }
