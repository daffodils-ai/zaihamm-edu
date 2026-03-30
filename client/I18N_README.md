# Internationalization (i18n) Setup

This project now supports multiple languages using Vue i18n. Currently, English (EN) and Hindi (HI) are supported.

## Features Added

- **vue-i18n**: Internationalization library for Vue.js
- **Language Switcher**: Buttons in the navbar to switch between English and Hindi
- **Translated Content**: Home page content is fully translatable
- **Persistent Language**: Language preference is maintained during the session

## How to Use

1. **Switch Language**: Click the "EN" or "HI" buttons in the top navigation bar
2. **Automatic Translation**: All text on the Home page will be translated instantly
3. **Mobile Support**: Language switcher is also available in the mobile menu

## Adding More Languages

To add more languages:

1. Create a new JSON file in `src/locales/` (e.g., `fr.json` for French)
2. Add the language messages following the same structure as `en.json`
3. Import and add the messages in `src/i18n.js`
4. Add a new button in the language switcher in `Navbar.vue`

## Adding Translatable Text

To make text translatable in any component:

1. Add the text key and value to all language JSON files
2. In the template, use `{{ $t('key.path') }}`
3. In scripts, use `this.$t('key.path')`

## Current Translation Coverage

- Navigation menu
- Home page hero section
- Welcome message
- Highlights section
- Programs section
- Facilities section
- News & Events
- Testimonials
- Call-to-action section

## Future Enhancements

- Add translations for other pages (About, Contact, etc.)
- Implement language persistence in localStorage
- Add RTL (Right-to-Left) support for languages like Arabic
- Integrate with a translation service for automatic updates