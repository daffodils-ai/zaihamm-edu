/**
 * Storage Service - Handles data persistence
 * Uses localStorage to persist data across browser sessions
 */

class StorageService {
  constructor() {
    this.prefix = 'edu_app_';
  }

  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  /**
   * Get item from localStorage
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  /**
   * Authentication methods
   */
  setToken(token) {
    this.setItem('token', token);
  }

  getToken() {
    return this.getItem('token');
  }

  removeToken() {
    this.removeItem('token');
  }

  /**
   * User data methods
   */
  setUser(user) {
    this.setItem('user', user);
  }

  getUser() {
    return this.getItem('user');
  }

  removeUser() {
    this.removeItem('user');
  }

  /**
   * User type methods (organization_user or student)
   */
  setUserType(userType) {
    this.setItem('userType', userType);
  }

  getUserType() {
    return this.getItem('userType');
  }

  /**
   * Filter state methods
   */
  setFilters(page, filters = {}) {
    this.setItem(`filters_${page}`, {
      ...filters,
      lastUpdated: new Date().toISOString(),
    });
  }

  getFilters(page) {
    return this.getItem(`filters_${page}`);
  }

  removeFilters(page) {
    this.removeItem(`filters_${page}`);
  }

  /**
   * List data cache methods
   */
  setListData(key, data) {
    this.setItem(`list_${key}`, {
      data,
      timestamp: new Date().toISOString(),
    });
  }

  getListData(key) {
    const cached = this.getItem(`list_${key}`);
    return cached ? cached.data : null;
  }

  removeListData(key) {
    this.removeItem(`list_${key}`);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }

  /**
   * Logout - clear all user data
   */
  logout() {
    this.removeToken();
    this.removeUser();
    this.removeItem('userType');
    this.removeItem('organizationId');
  }
}

export const storage = new StorageService();
