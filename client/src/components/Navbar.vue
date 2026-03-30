<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <div class="brand-logo">🎓</div>
        <div class="brand-text">
          <h1>{{ $t('nav.brand') }}</h1>
          <span>{{ $t('nav.tagline') }}</span>
        </div>
      </div>
      <div class="navbar-right">
        <ul class="navbar-menu">
          <li><router-link to="/" class="nav-link">{{ $t('nav.home') }}</router-link></li>
          <li><router-link to="/about" class="nav-link">{{ $t('nav.about') }}</router-link></li>
          <li><router-link to="/admission" class="nav-link">{{ $t('nav.admissions') }}</router-link></li>
          <li><router-link to="/facilities" class="nav-link">{{ $t('nav.facilities') }}</router-link></li>
          <li><router-link to="/notices" class="nav-link">{{ $t('nav.notices') }}</router-link></li>
          <li><router-link to="/contact" class="nav-link">{{ $t('nav.contact') }}</router-link></li>
          <li><a href="http://localhost:5173/login" class="nav-link admin-link">{{ $t('nav.admin') }}</a></li>
        </ul>
        <div class="language-switcher">
          <button @click="switchLanguage('en')" :class="{ active: $i18n.locale === 'en' }" title="English">EN</button>
          <span class="separator">|</span>
          <button @click="switchLanguage('hi')" :class="{ active: $i18n.locale === 'hi' }" title="हिंदी">HI</button>
        </div>
        <div class="mobile-menu-toggle" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <div class="mobile-language-switcher">
        <button @click="switchLanguage('en')" :class="{ active: $i18n.locale === 'en' }" title="English">EN</button>
        <span class="separator">|</span>
        <button @click="switchLanguage('hi')" :class="{ active: $i18n.locale === 'hi' }" title="हिंदी">HI</button>
      </div>
      <router-link to="/" @click="closeMobileMenu">{{ $t('nav.home') }}</router-link>
      <router-link to="/about" @click="closeMobileMenu">{{ $t('nav.about') }}</router-link>
      <router-link to="/admission" @click="closeMobileMenu">{{ $t('nav.admissions') }}</router-link>
      <router-link to="/facilities" @click="closeMobileMenu">{{ $t('nav.facilities') }}</router-link>
      <router-link to="/notices" @click="closeMobileMenu">{{ $t('nav.notices') }}</router-link>
      <router-link to="/contact" @click="closeMobileMenu">{{ $t('nav.contact') }}</router-link>
      <router-link to="/admin/login" @click="closeMobileMenu">{{ $t('nav.admin') }}</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    switchLanguage(lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  min-width: 0;
  flex-shrink: 1;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  font-size: 2.2rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.brand-text {
  min-width: 0;
  flex-shrink: 1;
}

.brand-text h1 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-text span {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 400;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.7rem;
  padding: 0.25rem 0.4rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.admin-link {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.mobile-menu.active {
  display: block;
}

.mobile-language-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.mobile-language-switcher button {
  background: transparent;
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.mobile-language-switcher button:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

.mobile-language-switcher button.active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
}

.mobile-language-switcher .separator {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 0 0.1rem;
}

.mobile-language-switcher .separator {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.mobile-menu a {
  display: block;
  color: white;
  text-decoration: none;
  padding: 0.6rem 2rem;
  font-weight: 500;
  font-size: 0.8rem;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Language Switcher */
.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  margin-left: 0.5rem;
}

.language-switcher button {
  background: transparent;
  border: none;
  color: white;
  padding: 0.15rem 0.3rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-switcher button:hover {
  background: rgba(255, 255, 255, 0.08);
  text-decoration: underline;
}

.language-switcher button.active {
  background: rgba(255, 255, 255, 0.12);
  font-weight: 600;
}

.language-switcher .separator {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin: 0 0.05rem;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .navbar-menu {
    display: none;
  }

  .language-switcher {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .brand-text h1 {
    font-size: 1.1rem;
  }

  .brand-text span {
    display: none;
  }

  .brand-logo {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    height: 70px;
  }

  .brand-logo {
    font-size: 1.6rem;
  }

  .brand-text h1 {
    font-size: 1rem;
  }
}
</style>
