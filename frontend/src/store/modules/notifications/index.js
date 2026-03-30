// Notifications Module - index.js
import { notifications } from '../../../api/api.js';

export default {
  namespaced: true,
  state() {
    return {
      notifications: [],
      notificationDetail: null,
      unreadCount: 0,
      pagination: { page: 1, limit: 20, total: 0 },
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_NOTIFICATIONS(state, data) {
      state.notifications = data;
    },
    SET_NOTIFICATION_DETAIL(state, data) {
      state.notificationDetail = data;
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count;
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
    async fetch({ commit }, { studentId, page = 1, limit = 20 } = {}) {
      try {
        commit('SET_LOADING', true);
        const response = await notifications.getByStudent(studentId, page, limit);
        if (response.success) {
          commit('SET_NOTIFICATIONS', response.data || []);
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
    async fetchUnreadCount({ commit }, studentId) {
      try {
        const response = await notifications.getUnreadCount(studentId);
        if (response.success) commit('SET_UNREAD_COUNT', response.data?.count || 0);
        return response;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    },
    async markAsRead({ commit }, notificationId) {
      try {
        commit('SET_LOADING', true);
        return await notifications.markRead(notificationId);
      } catch (error) {
        commit('SET_ERROR', error.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    notifications(state) {
      return state.notifications;
    },
    unreadCount(state) {
      return state.unreadCount;
    },
    isLoading(state) {
      return state.loading;
    },
  },
};
