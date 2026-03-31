// Admissions Module - index.js
import { admissions } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export default {
  namespaced: true,
  state: () => ({
    admissions: [],
    currentAdmission: null,
    isLoading: false,
    error: null
  }),

  mutations: {
    SET_ADMISSIONS(state, data) {
      state.admissions = data;
    },
    SET_CURRENT_ADMISSION(state, data) {
      state.currentAdmission = data;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },

  actions: {
    async fetchAdmissions({ commit, state }, { page = 1, limit = 20, filters = {} } = {}) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await admissions.getAll(page, limit, filters);
        
        if (response.success) {
          commit('SET_ADMISSIONS', response.data || []);
          
          // Store pagination info
          if (response.pagination) {
            storage.setFilters(`admissions_${page}`, {
              page,
              limit,
              total: response.pagination.total,
              pages: response.pagination.pages
            });
          }
        }
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchAdmissionById({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await admissions.getById(id);
        
        if (response.success) {
          commit('SET_CURRENT_ADMISSION', response.data);
        }
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createAdmission({ commit }, data) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await admissions.create(data);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateAdmission({ commit }, { id, data }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await admissions.update(id, data);
        
        if (response.success) {
          commit('SET_CURRENT_ADMISSION', response.data);
        }
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteAdmission({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await admissions.delete(id);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    admissions(state) {
      return state.admissions;
    },
    currentAdmission(state) {
      return state.currentAdmission;
    },
    isLoading(state) {
      return state.isLoading;
    },
    error(state) {
      return state.error;
    }
  }
};
