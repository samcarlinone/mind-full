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

// testCase
testWords = ['ease', 'noes', 'nose', 'not', 'note', 'notes', 'nots', 'sate', 'saw', 'sea', 'season', 'son', 'sow', 'sown', 'taste', 'test', 'toe', 'toes', 'ton', 'toss', 'tote', 'totes', 'was', 'waste', 'watt', 'watts', 'wet', 'woe', 'woes', 'won']

testBoard = [
  't', 'e', 's', 'e',
  'w', 'o', 's', 'a',
  'n', 't', 't', 'w',
  'v', 'qu', 'e', 't',
]
// end testCase

// 0 - 15 instruction space (nibble / half byte)
// 0 - 7 for directions
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

const DIRECTIONS_ENCODE_MAP = new Map(Object.values(DIRECTIONS).map(({index, offset}) => [offset, index]));
const DIRECTIONS_DECODE_MAP = new Map(Object.values(DIRECTIONS).map(({index, offset}) => [index, offset]));

// 13 - 8 for 2 - 7 branches
const getBranchCommand = (numberOfBranches) => 15 - numberOfBranches; 

// 14 - 15 start (+ index nibble)
const COMMANDS = {
  START: 14,
  END: 15,
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

  return paths;
};

const unique = (value, index, arr) => arr.indexOf(value) === index;

// Returns [
//  [[2, ...], [2, ...], ..., [2, ...]],
//  [[3, ...], [3, ...]],
// ]
const groupPaths = (wordsAsPathOptions) => {
  let wordsAsPaths = wordsAsPathOptions;

  let compatiblePaths = [];

  while (wordsAsPaths.length > 0) {
    firstIndexes = wordsAsPaths
      .map((wordPaths) => wordPaths.map((path) => path[0]))
      .map((wordFirstIndexes) => wordFirstIndexes.filter(unique))
      .reduce((counts, wordFirstIndexesUnique) => {
        wordFirstIndexesUnique.forEach((index) => counts[index] = (counts[index] ?? 0) + 1);
        return counts;
      }, {});

    mostCommonFirstIndex = Number(
      Object.entries(firstIndexes)
        .reduce((bestPair, pair) => pair[1] > bestPair[1] ? pair : bestPair)[0]
    );

    [wordsAsPaths, matchingWords] = wordsAsPaths.reduce(
      (result, wordPaths) => {
        const path = wordPaths.find((path) => path[0] === mostCommonFirstIndex);
        
        if (path) result[1].push(path);
        else result[0].push(wordPaths);

        return result;
      },
      [[], []],
    );

    compatiblePaths.push(matchingWords);
  };

  return compatiblePaths;
};

// Returns {index1: {index3: {}}, index2: {}}
const pathsToTree = (paths) => {
  const tree = {};

  paths.forEach((path) => {
    let node = tree;

    path.forEach((index) => {
      node[index] = node[index] ?? {};
      node = node[index];
    });
  });

  return tree;
};

const getDirectionInstruction = (index, childIndex) => {
  const current = Number(index);
  const next = Number(childIndex);

  return DIRECTIONS_ENCODE_MAP.get(next - current);
};

// Returns instructions list [COMMANDS.START, startIndex, DIRECTIONS.N, ...]
const generateInstructions = (obj) =>
  instructionsTraveler(obj).flat(Infinity);

// Generates a nested instructions list by visiting object tree nodes
const instructionsTraveler = (obj, parentIndex = -1) => {
  const children = Object.keys(obj);

  if (children.length === 0) return [COMMANDS.END];

  if (children.length === 1 && parentIndex === -1) {
    return [COMMANDS.START, Number(children[0]), instructionsTraveler(obj[children[0]], children[0])];
  }

  if (children.length === 1) {
    return [getDirectionInstruction(parentIndex, children[0]), instructionsTraveler(obj[children[0]], children[0])];
  }

  if (children.length > 1) {
    return [
      getBranchCommand(children.length),
      children.map(child => [getDirectionInstruction(parentIndex, child), instructionsTraveler(obj[child], child)])
    ];
  }

  throw `Invalid parent ${JSON.stringify(parent)}`;
};

// Convert a list of instructions (nibbles) into a url safe base64 encoded string
const instructionsToString = (instructions) => {
  let binaryString = '';

  for (let i = 0; i < instructions.length; i += 2) {
    binaryString += String.fromCharCode(instructions[i] << 4 | instructions[i + 1]);
  }

  return btoa(binaryString).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '~');
};

// Board compression function
const compressBoard = (board, words) => {
  const lookup = generateBoardLookup(board);
  const wordsAsPaths = words.map((word) => findPaths(word, lookup));

  const compatiblePaths = groupPaths(wordsAsPaths);
  const forest = compatiblePaths.map(pathsToTree);

  const instructions = forest.map(generateInstructions).flat();

  return instructionsToString(instructions);
};

compressBoard(testBoard, testWords)
