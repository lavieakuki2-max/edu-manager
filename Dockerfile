FROM php:8.2-cli

# 1. Dépendances système et Node.js
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# 2. Extensions PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# 3. Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 4. Copier d'abord les fichiers de dépendances (Maximise le cache Docker)
COPY package*.json composer.json composer.lock ./

# 5. Installer les dépendances Composer sans dev
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# 6. Copier l'ensemble du code source
COPY . .

# 7. Finaliser Composer & Build Vite
RUN composer dump-autoload --optimize --no-dev
RUN npm ci
RUN npm run build

# 8. Permissions correctes pour Laravel & le dossier Public
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 755 /var/www/public

EXPOSE 8000

# 9. Script de démarrage sécurisé
CMD php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan serve --host=0.0.0.0 --port=8000