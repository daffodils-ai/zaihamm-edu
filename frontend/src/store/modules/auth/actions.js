// Auth Module - actions.js
import { auth } from '../../../api/api.js';
import { storage } from '../../../service/StorageService.js';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const actions = {
  async orgUserLogin({ commit }, { email, password, organizationId }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await auth.orgUserLogin(email, password, organizationId);

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Decode token to get organizationId if not provided
        let orgId = organizationId;
        if (!orgId) {
          const decoded = decodeToken(token);
          orgId = decoded?.organizationId;
        }

        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        commit('SET_USER_TYPE', 'organization_user');
        commit('SET_ORGANIZATION_ID', orgId);
        commit('SET_AUTHENTICATED', true);

        // Persist to storage
        storage.setToken(token);
        storage.setUser(user);
        storage.setItem('userType', 'organization_user');
        storage.setItem('organizationId', orgId);

        return response;
      }
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Login failed';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async studentLogin({ commit }, { registrationNumber, password }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await auth.studentLogin(registrationNumber, password);

      if (response.success && response.data) {
        const { token, student } = response.data;

        commit('SET_TOKEN', token);
        commit('SET_USER', student);
        commit('SET_USER_TYPE', 'student');
        commit('SET_AUTHENTICATED', true);

        // Persist to storage
        storage.setToken(token);
        storage.setUser(student);
        storage.setItem('userType', 'student');

        return response;
      }
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Login failed';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async resetPassword({ commit }, { userId, newPassword }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      const response = await auth.resetPassword(userId, newPassword);
      return response;
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Password reset failed';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * Restore auth from storage
   */
  restoreAuth({ commit }) {
    const token = storage.getToken();
    const user = storage.getUser();
    const userType = storage.getItem('userType');
    const organizationId = storage.getItem('organizationId');

    if (token && user) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      commit('SET_USER_TYPE', userType);
      commit('SET_ORGANIZATION_ID', organizationId);
      commit('SET_AUTHENTICATED', true);
    }
  },

  /**
   * Logout
   */
  logout({ commit }) {
    commit('CLEAR_AUTH');
    storage.logout();
  },
};
