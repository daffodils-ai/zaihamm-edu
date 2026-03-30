// Students Module - actions.js
import { students } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

export const actions = {
  async fetchStudents({ commit }, { page = 1, limit = 20, filters = {} } = {}) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      commit('SET_FILTERS', filters);

      const response = await students.getAll(page, limit, filters);

      if (response.success) {
        commit('SET_STUDENTS', response.data || []);
        commit('SET_PAGINATION', response.pagination || {});

        // Persist filters and pagination
        storage.setFilters(`students_${page}`, { page, limit, ...filters });
      }

      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to fetch students';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchStudentById({ commit }, studentId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await students.getById(studentId);

      if (response.success) {
        commit('SET_STUDENT_DETAIL', response.data);
      }

      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to fetch student';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createStudent({ commit }, studentData) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await students.admit(studentData);
      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to create student';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateStudent({ commit }, { id, data }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await students.update(id, data);
      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to update student';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteStudent({ commit }, studentId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await students.delete(studentId);
      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to delete student';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async promoteStudent({ commit }, { id, data }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await students.promote(id, data);
      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Failed to promote student';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  clearFilters({ commit }) {
    commit('CLEAR_STUDENTS');
  },
};
