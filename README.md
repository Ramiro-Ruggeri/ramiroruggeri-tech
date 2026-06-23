# ramiroruggeri.tech

Portfolio profesional de Ramiro Ruggeri — Full Stack Developer con foco en datos, análisis y QA.

## Stack

- **Build**: Vite + Sass
- **UI**: Bootstrap 5 (grid + utilities) + custom SCSS por capas Atomic Design
- **Interactividad**: Alpine.js (stores para i18n y theme, componentes para form)
- **Server**: Node.js + Express, sirviendo `dist/` y exponiendo `/api/contact`
- **Process manager**: PM2
- **Reverse proxy**: Nginx con HTTPS (Let's Encrypt)

## Arquitectura del CSS (Atomic Design)

```
src/scss/
├── 01-tokens/      → variables, tipografía, CSS custom props (theming)
├── 02-base/        → reset + globals
├── 03-atoms/       → tag, link, icon-btn, eyebrow
├── 04-molecules/   → nav, skill-card, project, xp, contact-row, contact-form
├── 05-organisms/   → hero, section, footer
├── 06-template/    → layout (wrap)
└── main.scss       → entry, importa todo en orden
```

## Desarrollo local

```bash
# 1. instalar deps
npm install

# 2. copiar .env (opcional, solo si querés probar /api/contact con email real)
cp .env.example .env

# 3. dev server (Vite, con HMR) en http://localhost:5173
npm run dev
```

## Build + correr server completo

```bash
# 1. compilar el front
npm run build

# 2. correr Express (sirve dist/ + endpoints) en http://localhost:3000
npm run server
```

## Scripts

| Script              | Qué hace                                      |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Vite dev server con HMR                       |
| `npm run build`     | Build de producción → `dist/`                 |
| `npm run preview`   | Preview del build                             |
| `npm run server`    | Corre Express server                          |
| `npm run pm2:start` | Levanta PM2 con ecosystem.config.cjs          |
| `npm run pm2:logs`  | Logs del proceso                              |
| `npm run lint`      | ESLint                                        |
| `npm run lint:fix`  | ESLint con auto-fix                           |
| `npm run format`    | Prettier sobre todo el repo                   |

## Variables de entorno

Ver `.env.example`. Las del bloque SMTP solo son necesarias para activar `/api/contact`.

## Deploy en VPS

Ver [DEPLOY.md](./DEPLOY.md).

## Estructura del proyecto

```
ramiroruggeri-tech/
├── src/                  → código fuente
│   ├── scss/             → estilos por capas
│   ├── js/               → entry + Alpine stores/components
│   ├── data/             → diccionarios i18n (es.json, en.json)
│   └── index.html
├── server/               → Express + PM2 config
├── nginx/                → vhost listo para copiar
├── public/               → assets estáticos (foto.jpg, cv.pdf)
├── package.json
└── vite.config.js
```

---

© 2026 Ramiro Ruggeri
