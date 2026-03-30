// Students Module - mutations.js
export const mutations = {
  SET_STUDENTS(state, students) {
    state.students = students;
  },

  SET_STUDENT_DETAIL(state, student) {
    state.studentDetail = student;
  },

  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },

  SET_FILTERS(state, filters) {
    state.filters = filters;
  },

  SET_LOADING(state, value) {
    state.loading = value;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  CLEAR_STUDENTS(state) {
    state.students = [];
    state.studentDetail = null;
    state.filters = {};
    state.error = null;
  },

  TOGGLE_STUDENT_ACTIVE(state, studentId) {
    const student = state.students.find((s) => s._id === studentId);
    if (student) {
      student.is_active = !student.is_active;
    }
  },
};
