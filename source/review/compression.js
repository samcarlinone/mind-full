// import {isAdjacent} from '../shared/isAdjacent';
// isAdjacent
const SIZE = 4

const indexDistance = (index1, index2) =>
  Math.sqrt(
    (index1 % SIZE - index2 % SIZE) ** 2 +
    (Math.floor(index1 / SIZE) - Math.floor(index2 / SIZE)) ** 2
  );

const isAdjacent = (index1, index2) => indexDistance(index1, index2) < 1.5;
// end isAdjacent

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

// Returns {letter: [index1, index2, ...]}
const generateBoardLookup = (board) => board.reduce((map, currentLetter, index) => {
  map[currentLetter] = [...(map[currentLetter] ?? []), index];
  return map;
}, {});

// Returns [[index1, index2, ..., indexN], ...]
const findPaths = (word, lookup) => {
  let paths = lookup[word[0]].map((index) => [index]);

  for (const letter of word.slice(1)) {
    let continuedPaths = [];

    for (const existingPath of paths) {
      for (const index of lookup[letter]) {
        if (isAdjacent(index, existingPath[existingPath.length - 1]) && !existingPath.includes(index)) {
          continuedPaths.push([...existingPath, index]);
        }
      }
    }

    paths = continuedPaths;
  }

  return paths
}

lookup = generateBoardLookup(board);

findPaths('toe', lookup)
