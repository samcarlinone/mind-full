const stringToDecode = '4sNXdvbXX29NZfX-rQsDPxPyX28nZP6CsDPxPyf1L-vRwPdk9nL2D-Q9E_b-A0b-NQfw';

testBoard = [
  't', 'e', 's', 'e',
  'w', 'o', 's', 'a',
  'n', 't', 't', 'w',
  'v', 'qu', 'e', 't',
]

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
const getBranchCount = (branchCommand) => 15 - branchCommand; 

// 14 - 15 start (+ index nibble)
const COMMANDS = {
  START: 14,
  END: 15,
};

const stringToInstructions = (str) => {
  const base64Str = str.replaceAll('-', '+').replaceAll('_', '/').replaceAll('~', '=');
  const binaryStr = atob(base64Str);

  return [...binaryStr].map(char => [(char.charCodeAt(0) & 0b11110000) >> 4, char.charCodeAt(0) & 0b1111]).flat();
}

const instructionsToWords = (board, instructions) => {
  let words = [];

  let lastIndex = [];
  let branchCount = [];
  let prefixes = [''];

  let currentIndex = 0;
  let segment = '';

  for (let i = 0; i < instructions.length; i++) {
    if (DIRECTIONS_DECODE_MAP.has(instructions[i])) {
      currentIndex += DIRECTIONS_DECODE_MAP.get(instructions[i]);
      segment += board[currentIndex];

      continue;
    }

    if (instructions[i] === COMMANDS.START) {
      lastIndex = [instructions[i + 1]];
      i++;
      
      branchCount = [];
      prefixes = [board[lastIndex[0]]];
      
      currentIndex = lastIndex[0];
      segment = '';

      continue;
    }

    if (instructions[i] === COMMANDS.END) {
      words.push(prefixes[0] + segment);

      // Branch completed
      if (branchCount[0] === 1) {
        lastIndex.shift();
        branchCount.shift();
        prefixes.shift();
      } else {
        branchCount[0] -= -1;
      }

      currentIndex = lastIndex[0];
      segment = '';

      continue;
    }

    // Branch command
    lastIndex.unshift(currentIndex);
    branchCount.unshift(getBranchCount(instructions[i]));
    prefixes.unshift(prefixes[0] + segment);

    segment = '';
  }

  return words.sort((a, b) => a.localeCompare(b));
}

console.log(
  instructionsToWords(testBoard, stringToInstructions(stringToDecode)),
  ['ease', 'noes', 'nose', 'not', 'note', 'notes', 'nots', 'sate', 'saw', 'sea', 'season', 'son', 'sow', 'sown', 'taste', 'test', 'toe', 'toes', 'ton', 'toss', 'tote', 'totes', 'was', 'waste', 'watt', 'watts', 'wet', 'woe', 'woes', 'won'].sort((a, b) => a.localeCompare(b)),
);
