// Notices Module - index.js
import { notices } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      notices: [],
      noticeDetail: null,
      pagination: { page: 1, limit: 20, total: 0 },
      filters: {},
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_NOTICES(state, data) {
      state.notices = data;
    },
    SET_NOTICE_DETAIL(state, data) {
      state.noticeDetail = data;
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
        const response = await notices.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_NOTICES', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`notices_${page}`, { page, limit, ...filters });
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchRecent({ commit }) {
      try {
        commit('SET_LOADING', true);
        return await notices.getRecent();
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
        const response = await notices.getById(id);
        if (response.success) commit('SET_NOTICE_DETAIL', response.data);
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
        return await notices.create(data);
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
        return await notices.update(id, data);
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
        return await notices.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    notices(state) {
      return state.notices;
    },
    noticeDetail(state) {
      return state.noticeDetail;
    },
    isLoading(state) {
      return state.loading;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
