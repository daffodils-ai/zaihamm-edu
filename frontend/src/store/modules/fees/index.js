// Fees Module - index.js
import { fees } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      fees: [],
      feeDetail: null,
      pagination: { page: 1, limit: 20, total: 0 },
      filters: {},
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_FEES(state, data) {
      state.fees = data;
    },
    SET_FEE_DETAIL(state, data) {
      state.feeDetail = data;
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
  },
  actions: {
    async fetch({ commit }, { page = 1, limit = 20, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await fees.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_FEES', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`fees_${page}`, { page, limit, ...filters });
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchByStudent({ commit }, { studentId, page = 1, limit = 20 } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await fees.getByStudent(studentId, page, limit);
        if (response.success) {
          commit('SET_FEES', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
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
        const response = await fees.getById(id);
        if (response.success) commit('SET_FEE_DETAIL', response.data);
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
        return await fees.create(data);
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
        return await fees.update(id, data);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async pay({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        return await fees.pay(id);
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
        return await fees.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    fees(state) {
      return state.fees;
    },
    feeDetail(state) {
      return state.feeDetail;
    },
    isLoading(state) {
      return state.loading;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
