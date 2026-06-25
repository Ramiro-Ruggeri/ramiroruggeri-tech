// =============================================================
// src/js/contact-form.js
// Alpine component for the contact form. POSTs to /api/contact.
// Includes native autofill-friendly fields and client validation.
// =============================================================

function t(path, fallback) {
  try {
    return window.Alpine?.store('i18n')?.t(path) || fallback;
  } catch {
    return fallback;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function contactForm() {
  return {
    name: '',
    email: '',
    message: '',
    state: 'idle', // idle | sending | ok | error
    error: '',

    validate() {
      const name = this.name.trim();
      const email = this.email.trim();
      const message = this.message.trim();

      if (name.length < 2) {
        return t('contact.validation_name', 'Enter your name.');
      }

      if (!email) {
        return t('contact.validation_email_required', 'Enter your email.');
      }

      if (!email.includes('@')) {
        return t('contact.validation_email_at', 'Your email must include @.');
      }

      if (!isValidEmail(email)) {
        return t('contact.validation_email_format', 'Enter a valid email.');
      }

      if (message.length < 10) {
        return t('contact.validation_message', 'Write a slightly more complete message.');
      }

      return '';
    },

    async submit() {
      this.state = 'idle';
      this.error = this.validate();

      if (this.error) {
        this.state = 'error';
        return;
      }

      this.state = 'sending';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name.trim(),
            email: this.email.trim(),
            message: this.message.trim(),
          }),
        });

        if (!res.ok) throw new Error('bad status ' + res.status);

        this.state = 'ok';
        this.name = '';
        this.email = '';
        this.message = '';
        this.error = '';
      } catch (e) {
        console.error(e);
        this.error = t('contact.error', 'Could not send. Try again or email me.');
        this.state = 'error';
      }
    },
  };
}
