FROM php:8.2-cli

# Installation des dépendances système et Node.js
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Installation de Node.js (v18)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Extensions PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copie des fichiers
COPY . .

# Installation des dépendances PHP et compilation JS/Vite
RUN composer install --no-dev --optimize-autoloader
RUN npm ci || npm install
RUN npm run build

# Creation et configuration des dossiers de cache et build
RUN mkdir -p /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/public/build

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/build
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/public/build

EXPOSE 8000

CMD php artisan config:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000