const SIZE = 4

const indexDistance = (index1, index2) =>
  Math.sqrt(
    (index1 % SIZE - index2 % SIZE) ** 2 +
    (Math.floor(index1 / SIZE) - Math.floor(index2 / SIZE)) ** 2
  );

export const isAdjacent = (index1, index2) => indexDistance(index1, index2) < 1.5;
