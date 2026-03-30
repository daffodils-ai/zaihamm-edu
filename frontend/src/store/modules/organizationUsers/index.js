// Organization Users Module - index.js
import { organizationUsers } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      users: [],
      userDetail: null,
      pagination: { page: 1, limit: 20, total: 0 },
      filters: {},
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_USERS(state, data) {
      state.users = data;
    },
    SET_USER_DETAIL(state, data) {
      state.userDetail = data;
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
      const item = state.users.find((u) => u._id === id);
      if (item) item.is_active = !item.is_active;
    },
  },
  actions: {
    async fetch({ commit }, { page = 1, limit = 20, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await organizationUsers.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_USERS', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`orgusers_${page}`, { page, limit, ...filters });
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
        const response = await organizationUsers.getById(id);
        if (response.success) commit('SET_USER_DETAIL', response.data);
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
        return await organizationUsers.create(data);
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
        return await organizationUsers.update(id, data);
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
        return await organizationUsers.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    users(state) {
      return state.users;
    },
    userDetail(state) {
      return state.userDetail;
    },
    isLoading(state) {
      return state.loading;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
