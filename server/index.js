// =============================================================
// server/index.js
// Express server: serves dist/ static + /api/contact endpoint.
// Production-ready: helmet, compression, rate-limit, env vars.
// =============================================================
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- security & perf ----
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// ---- /api rate limit ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' },
});

// ---- /api/contact ----
app.post('/api/contact', apiLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (
      !name || typeof name !== 'string' || name.length > 100 ||
      !email || typeof email !== 'string' || email.length > 200 ||
      !message || typeof message !== 'string' || message.length > 4000
    ) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // If SMTP not configured, log + accept (dev mode)
    if (!process.env.SMTP_HOST) {
      console.info('[contact] (no SMTP configured) from=%s name=%s', email, name);
      return res.json({ ok: true, dev: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ramiroruggeri.tech" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Portfolio] Mensaje de ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ---- health ----
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ---- static (built site) ----
app.use(
  express.static(DIST, {
    maxAge: '7d',
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// SPA-style fallback (not strictly needed here, but harmless)
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.info(`ramiroruggeri.tech running on :${PORT} (env=${process.env.NODE_ENV || 'dev'})`);
});

