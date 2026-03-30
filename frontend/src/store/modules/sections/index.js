// Sections Module - index.js
import { sections } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state() {
    return {
      sections: [],
      sectionDetail: null,
      pagination: { page: 1, limit: 20, total: 0 },
      filters: {},
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_SECTIONS(state, data) {
      state.sections = data;
    },
    SET_SECTION_DETAIL(state, data) {
      state.sectionDetail = data;
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
      const item = state.sections.find((s) => s._id === id);
      if (item) item.is_active = !item.is_active;
    },
  },
  actions: {
    async fetch({ commit }, { page = 1, limit = 20, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await sections.getAll(page, limit, filters);
        if (response.success) {
          commit('SET_SECTIONS', response.data || []);
          commit('SET_PAGINATION', response.pagination || {});
          storage.setFilters(`sections_${page}`, { page, limit, ...filters });
        }
        return response;
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchByClass({ commit }, { classId, page = 1, limit = 20 } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await sections.getByClass(classId, page, limit);
        if (response.success) {
          commit('SET_SECTIONS', response.data || []);
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
        const response = await sections.getById(id);
        if (response.success) commit('SET_SECTION_DETAIL', response.data);
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
        return await sections.create(data);
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
        return await sections.update(id, data);
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
        return await sections.delete(id);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    sections(state) {
      return state.sections;
    },
    sectionDetail(state) {
      return state.sectionDetail;
    },
    isLoading(state) {
      return state.loading;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
