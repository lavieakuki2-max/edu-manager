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

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 1. Copier d'abord le code
COPY . .

# 2. Installer composer sans dev
RUN composer install --no-dev --optimize-autoloader

# 3. Installer npm (ci = build déterministe via le lockfile) et builder les assets
RUN npm ci
RUN npm run build

# 4. S'ASSURER QUE LE DOSSIER BUILD A TOUTES LES PERMISSIONS (Fix MIME / 404)
RUN chmod -R 755 /var/www/public

EXPOSE 8000

# 5. Nettoyer le cache au démarrage et lancer le serveur
CMD php artisan optimize:clear && php artisan serve --host=0.0.0.0 --port=8000