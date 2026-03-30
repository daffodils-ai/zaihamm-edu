// Auth Module - state.js
export const state = () => ({
  token: null,
  user: null,
  userType: null, // 'organization_user' or 'student'
  organizationId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
});
