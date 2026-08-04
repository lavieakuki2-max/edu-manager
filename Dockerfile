FROM php:8.2-cli

# Dépendances système et Node.js
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Installation des paquets et compilation des assets
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Création du dossier build et attribution des droits
RUN mkdir -p /var/www/public/build
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/public

EXPOSE 8000

# CORRECTION : Nettoyage complet de tous les caches (Inertia + Laravel) au démarrage
CMD php artisan optimize:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000