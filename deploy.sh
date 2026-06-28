#!/bin/bash
set -e

echo "Starting Deployment..."

# Ensure we are in a working directory
cd /var/www || mkdir -p /var/www && cd /var/www

# Check if repo exists
if [ -d "nepsfood" ]; then
    echo "Pulling latest changes..."
    cd nepsfood
    git fetch origin main
    git reset --hard origin/main
else
    echo "Cloning repository..."
    git clone https://github.com/sunilparajuli/nepsfood.git
    cd nepsfood
fi

# Ensure composer and npm are installed
if ! command -v composer &> /dev/null; then
    echo "Composer not found. Installing composer..."
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
fi

if ! command -v npm &> /dev/null; then
    echo "NPM not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Installing NPM dependencies..."
npm ci --legacy-peer-deps

echo "Building frontend assets..."
npm run build

# Setup .env
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
    
    # Configure SQLite
    touch database/database.sqlite
    sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
    sed -i 's/DB_DATABASE=.*/#DB_DATABASE=/' .env
fi

echo "Running migrations..."
php artisan migrate --force

echo "Setting permissions..."
chown -R www-data:www-data /var/www/nepsfood
chmod -R 775 storage bootstrap/cache

# Restart web server (assuming nginx/php-fpm or apache)
if systemctl list-unit-files | grep -q nginx; then
    systemctl restart nginx || true
fi
if systemctl list-unit-files | grep -q apache2; then
    systemctl restart apache2 || true
fi
if systemctl list-unit-files | grep -q php; then
    systemctl restart php8.1-fpm || systemctl restart php8.2-fpm || systemctl restart php8.3-fpm || true
fi

echo "Deployment complete! Your app should be live."
