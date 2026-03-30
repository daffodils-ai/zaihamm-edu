// Auth Module - getters.js
export const getters = {
  token(state) {
    return state.token;
  },

  user(state) {
    return state.user;
  },

  userType(state) {
    return state.userType;
  },

  organizationId(state) {
    return state.organizationId;
  },

  isAuthenticated(state) {
    return state.isAuthenticated;
  },

  isOrgUser(state) {
    return state.userType === 'organization_user';
  },

  isStudent(state) {
    return state.userType === 'student';
  },

  isLoading(state) {
    return state.loading;
  },

  error(state) {
    return state.error;
  },

  userName(state) {
    if (state.userType === 'organization_user') {
      return `${state.user?.firstName || ''} ${state.user?.lastName || ''}`.trim();
    }
    return state.user?.fullName || '';
  },

  userEmail(state) {
    return state.user?.email || '';
  },
};
