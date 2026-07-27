FROM php:8.2-fpm

# Installation des dépendances système et Node.js pour Vite
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nginx

# Installation de Node.js (v18) et NPM
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Installation des extensions PHP requis par Laravel & PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Récupération de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copie de l'intégralité du code source
COPY . .

# Installation des dépendances PHP et JavaScript
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Configuration des permissions pour le stockage, le cache et les builds
RUN mkdir -p /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/public/build

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/build
RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache /var/www/public/build

EXPOSE 8000

CMD php artisan config:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000