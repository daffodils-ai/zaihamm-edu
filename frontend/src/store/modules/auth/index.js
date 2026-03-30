// Auth Module - index.js
import { state } from './state.js';
import { mutations } from './mutations.js';
import { actions } from './actions.js';
import { getters } from './getters.js';

export default {
  namespaced: true,
  state: typeof state === 'function' ? state() : state,
  mutations,
  actions,
  getters,
};
