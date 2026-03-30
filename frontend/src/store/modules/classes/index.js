// Classes Module - index.js
import { classes } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      classes: [],
      classDetail: null,
      pagination: { page: 1, limit: 20, total: 0 },
      filters: {},
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_CLASSES(state, data) {
      state.classes = data;
    },
    SET_CLASS_DETAIL(state, data) {
      state.classDetail = data;
    },
    SET_PAGINATION(state, data) {
      state.pagination = data;
    },
    SET_FILTERS(state, data) {
      state.filters = data;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    },
    TOGGLE_ACTIVE(state, id) {
      const item = state.classes.find((c) => c._id === id);
      if (item) item.is_active = !item.is_active;
    },
  },
  actions: {
    async fetch({ commit }, { page = 1, limit = 20, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await classes.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_CLASSES', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`classes_${page}`, { page, limit, ...filters });
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchById({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        const response = await classes.getById(id);
        if (response.success) commit('SET_CLASS_DETAIL', response.data);
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async create({ commit }, data) {
      try {
        commit('SET_LOADING', true);
        return await classes.create(data);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async update({ commit }, { id, data }) {
      try {
        commit('SET_LOADING', true);
        return await classes.update(id, data);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async delete({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        return await classes.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    classes(state) {
      return state.classes;
    },
    classDetail(state) {
      return state.classDetail;
    },
    isLoading(state) {
      return state.loading;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
