import './scroll-reveal.js';
// =============================================================
// src/js/main.js
// Entry point. Wires Alpine stores + components, imports SCSS,
// and starts Alpine.
// =============================================================
import Alpine from 'alpinejs';

import '../scss/main.scss';
import { registerI18n } from './i18n.js';
import { registerTheme } from './theme.js';
import { contactForm } from './contact-form.js';

// Register stores BEFORE Alpine.start()
registerI18n(Alpine);
registerTheme(Alpine);

// Register components
Alpine.data('contactForm', contactForm);

// Expose to window for debugging (optional)
window.Alpine = Alpine;

Alpine.start();

