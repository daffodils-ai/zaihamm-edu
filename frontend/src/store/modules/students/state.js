// Students Module - state.js
export const state = () => ({
  students: [],
  studentDetail: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  filters: {},
  loading: false,
  error: null,
});
