import { examResults } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      examResults: [],
      examResultDetail: null,
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_RESULTS(state, data) {
      state.examResults = data;
    },
    SET_RESULT_DETAIL(state, data) {
      state.examResultDetail = data;
    },
    SET_PAGINATION(state, data) {
      state.pagination = data;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    },
  },
  actions: {
    async fetch({ commit }, { page = 1, limit = 10, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await examResults.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_RESULTS', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`exam_results_${page}`, { page, limit, ...filters });
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
        const response = await examResults.getById(id);
        if (response.success) {
          commit('SET_RESULT_DETAIL', response.data);
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async create({ commit }, payload) {
      try {
        commit('SET_LOADING', true);
        return await examResults.create(payload);
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
        return await examResults.update(id, data);
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
        return await examResults.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async finalize({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        return await examResults.finalize(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    examResults(state) {
      return state.examResults;
    },
    examResultDetail(state) {
      return state.examResultDetail;
    },
    pagination(state) {
      return state.pagination;
    },
    isLoading(state) {
      return state.loading;
    },
  },
};
