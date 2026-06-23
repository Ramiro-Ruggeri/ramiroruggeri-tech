# Deploy en VPS Hostinger

Guía paso a paso para deployar `ramiroruggeri.tech` en un VPS Ubuntu de Hostinger
con Node + PM2 + Nginx + Let's Encrypt.

## 1. Preparar el VPS (una sola vez)

```bash
# Conectarse por SSH
ssh root@TU_IP

# Actualizar
apt update && apt upgrade -y

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 global
npm install -g pm2

# Nginx
apt install -y nginx

# Certbot (Let's Encrypt)
apt install -y certbot python3-certbot-nginx

# Firewall (si UFW está activo)
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

## 2. Clonar el repo

```bash
cd /var/www
git clone https://github.com/Ramiro-Ruggeri/ramiroruggeri-tech.git
cd ramiroruggeri-tech
```

## 3. Variables de entorno

```bash
cp .env.example .env
nano .env
```

Editar al menos `SMTP_USER`, `SMTP_PASS` (App Password de Gmail) y `CONTACT_TO`.

## 4. Instalar deps + build

```bash
npm ci
npm run build
```

## 5. Levantar con PM2

```bash
npm run pm2:start

# Asegurar que PM2 arranque tras reiniciar el server
pm2 save
pm2 startup
# (PM2 te imprime un comando para copiar y ejecutar)
```

## 6. Configurar Nginx

```bash
# Copiar el vhost
cp nginx/ramiroruggeri.tech.conf /etc/nginx/sites-available/ramiroruggeri.tech

# Activar
ln -s /etc/nginx/sites-available/ramiroruggeri.tech /etc/nginx/sites-enabled/

# Quitar el default si está
rm /etc/nginx/sites-enabled/default

# Test + reload
nginx -t
systemctl reload nginx
```

## 7. DNS

En el panel de Hostinger, apuntar el dominio al VPS:

| Tipo | Nombre | Valor          |
| ---- | ------ | -------------- |
| A    | @      | TU_IP_VPS      |
| A    | www    | TU_IP_VPS      |

Esperar propagación (5–30 min).

## 8. HTTPS con Let's Encrypt

```bash
certbot --nginx -d ramiroruggeri.tech -d www.ramiroruggeri.tech
```

Certbot completa automáticamente el bloque SSL del vhost. Renovación automática
ya queda configurada por cron.

## 9. Verificar

- Visitar `https://ramiroruggeri.tech` → debe cargar el portfolio.
- `https://ramiroruggeri.tech/api/health` → `{ "ok": true, ... }`
- Logs: `pm2 logs ramiroruggeri`

## 10. Updates posteriores

Cada vez que hagas un cambio:

```bash
cd /var/www/ramiroruggeri-tech
git pull
npm ci
npm run build
pm2 reload ramiroruggeri
```

## Troubleshooting

- **502 Bad Gateway** → Node no está corriendo. `pm2 status` y `pm2 logs`.
- **Permission denied al copiar nginx conf** → necesitás sudo / root.
- **El sitio no se ve actualizado** → `pm2 reload` y limpiar caché del browser.
- **Form de contacto no manda mails** → revisá `.env`, especialmente el App Password
  de Gmail (no es tu contraseña normal, hay que generarla en la config de Gmail).
