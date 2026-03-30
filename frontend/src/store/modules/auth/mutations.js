// Auth Module - mutations.js
export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },

  SET_USER(state, user) {
    state.user = user;
  },

  SET_USER_TYPE(state, userType) {
    state.userType = userType;
  },

  SET_ORGANIZATION_ID(state, organizationId) {
    state.organizationId = organizationId;
  },

  SET_AUTHENTICATED(state, value) {
    state.isAuthenticated = value;
  },

  SET_LOADING(state, value) {
    state.loading = value;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    state.userType = null;
    state.organizationId = null;
    state.isAuthenticated = false;
    state.error = null;
  },
};
