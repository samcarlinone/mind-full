import Chance from 'chance'

import {DICE} from '../shared/constants'

export const generateBoard = (seed) => {
  const gen = new Chance(seed);

  const letters = DICE
    .map((die) => gen.pickone(die.split("")))
    .map((letter) => letter === "Q" ? "Qu" : letter);

  return gen.shuffle(letters);
}
