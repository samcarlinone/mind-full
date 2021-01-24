export const scoreWord = ({ word }) =>
  ({ 3: 1, 4: 1, 5: 2, 6: 3, 7: 5 }[word.length] ?? 11);
