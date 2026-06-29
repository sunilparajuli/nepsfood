#!/bin/bash
set -e

echo "==> Deploying NepsFood"
cd /var/www/nepsfood
git add .
git stash
git pull origin main

php artisan migrate --force

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if command -v npm &> /dev/null; then
    npm install
    npm run build
else
    echo "npm not found even after nvm source. Please install node/npm on the server."
fi

chown -R www-data:www-data /var/www/nepsfood/storage /var/www/nepsfood/bootstrap/cache

# Setup Nginx VHost if it doesn't exist
NGINX_CONF="/etc/nginx/sites-available/nepsfood.nepstrading.com.au"
if [ ! -f "$NGINX_CONF" ]; then
    echo "==> Setting up Nginx VHost"
    cat <<'NGINX' > $NGINX_CONF
server {
    listen 80;
    server_name nepsfood.nepstrading.com.au;
    root /var/www/nepsfood/public;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX
    ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    echo "==> Requesting SSL"
    certbot --nginx -d nepsfood.nepstrading.com.au --non-interactive --agree-tos -m admin@nepstrading.com.au || echo "Certbot failed, but continuing..."
fi

echo "==> Deployment Complete"
