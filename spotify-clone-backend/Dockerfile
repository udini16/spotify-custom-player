# Use official PHP 8.4 with Apache
FROM php:8.4-apache

# Install tools needed for Laravel
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install zip pdo pdo_mysql

# Enable Apache routing
RUN a2enmod rewrite

# Point Apache to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 🚨 RENDER PORT FIX: Tell Apache to listen on Render's assigned port instead of 80
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy your code into the container
WORKDIR /var/www/html
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create an empty SQLite database file
RUN touch /var/www/html/database/database.sqlite

# Set folder permissions (Notice we added the database folder here!)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Run database migrations, then start the Apache server
CMD php artisan migrate --force && apache2-foreground
