FROM php:8.4-fpm

# system deps
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libonig-dev libpng-dev libpq-dev

# php extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . /var/www

RUN composer install --no-dev --optimize-autoloader

# storage permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true

EXPOSE 8000
CMD ["php-fpm"]