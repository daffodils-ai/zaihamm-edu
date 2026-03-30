// Students Module - getters.js
export const getters = {
  students(state) {
    return state.students;
  },

  studentDetail(state) {
    return state.studentDetail;
  },

  pagination(state) {
    return state.pagination;
  },

  filters(state) {
    return state.filters;
  },

  isLoading(state) {
    return state.loading;
  },

  error(state) {
    return state.error;
  },

  totalStudents(state) {
    return state.pagination?.total || 0;
  },

  totalPages(state) {
    return state.pagination?.pages || 0;
  },

  currentPage(state) {
    return state.pagination?.page || 1;
  },

  studentById: (state) => (id) => {
    return state.students.find((s) => s._id === id);
  },
};
