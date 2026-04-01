// Main Store - index.js
import { createStore } from 'vuex';
import auth from './modules/auth/index.js';
import students from './modules/students/index.js';
import classes from './modules/classes/index.js';
import sections from './modules/sections/index.js';
import admissions from './modules/admissions/index.js';
import notices from './modules/notices/index.js';
import fees from './modules/fees/index.js';
import examResults from './modules/examResults/index.js';
import organizationUsers from './modules/organizationUsers/index.js';
import notifications from './modules/notifications/index.js';

const store = createStore({
  modules: {
    auth,
    students,
    classes,
    sections,
    admissions,
    notices,
    fees,
    examResults,
    organizationUsers,
    notifications,
  },
});

export default store;
