// =============================================================
// src/js/contact-form.js
// Alpine component for the contact form. POSTs to /api/contact.
// =============================================================

export function contactForm() {
  return {
    name: '',
    email: '',
    message: '',
    state: 'idle', // idle | sending | ok | error
    error: '',

    async submit() {
      this.state = 'sending';
      this.error = '';
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            message: this.message,
          }),
        });

        if (!res.ok) throw new Error('bad status ' + res.status);

        this.state = 'ok';
        this.name = '';
        this.email = '';
        this.message = '';
      } catch (e) {
        console.error(e);
        this.state = 'error';
      }
    },
  };
}
