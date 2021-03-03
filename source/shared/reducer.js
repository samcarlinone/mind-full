import Chance from 'chance';

import {LOCAL_STORAGE, PHASES, LONG_VIBRATION} from './constants';

const TOGGLE_GROUP = 'toggle-group';
const SET_SEED = 'set-seed';
const ADD_WORD = 'add-word';

const START_GAME = 'start-game';
const END_GAME = 'end-game';
const RESTART_GAME = 'restart-game';
const REVIEW_LAST = 'review-last';

export const ACTIONS = {
  TOGGLE_GROUP,
  SET_SEED,
  ADD_WORD,

  START_GAME,
  END_GAME,
  RESTART_GAME,
  REVIEW_LAST,
}

export const INITIAL_STATE = {
  phase: PHASES.SETUP,
  group: false,
  seed: '',
  words: [],
};

export const reducer = {
  [TOGGLE_GROUP]: (state) => {
    state.group = !state.group;

    if (state.group) state.seed = '';
  },
  [SET_SEED]: (state, action) => {
    state.seed = action.payload;
  },
  [ADD_WORD]: (state, action) => {
    const word = action.payload;
    const isInvalid = word.length < 3 || state.words.includes(word);

    if (!isInvalid) {
      if (window.navigator.vibrate) window.navigator.vibrate(LONG_VIBRATION);

      state.words.unshift(word);
    }
  },

  [START_GAME]: (state) => {
    if (!state.group) state.seed = new Chance().string({length: 8});
    state.phase = PHASES.PLAY;
  },
  [RESTART_GAME]: (state) => {
      state.phase = PHASES.SETUP;
      state.words = [];
      state.seed = '';
  },
  [END_GAME]: (state) => {    
    try {
      const {seed, words, group} = state;

      localStorage.setItem(
        LOCAL_STORAGE.LAST_GAME,
        JSON.stringify({ seed, words, group })
      );
    } catch (e) {}

    state.phase = PHASES.REVIEW;
  },
  [REVIEW_LAST]: (state) => {
    if (!localStorage.getItem(LOCAL_STORAGE.LAST_GAME)) return;
    
    const {seed, words, group} = JSON.parse(localStorage.getItem(LOCAL_STORAGE.LAST_GAME));
    
    state.seed = seed;
    state.words = words;
    state.group = group;
    state.phase = PHASES.REVIEW;
  },
};
