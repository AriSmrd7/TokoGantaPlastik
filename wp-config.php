<?php

//Begin Really Simple SSL session cookie settings
@ini_set('session.cookie_httponly', true);
@ini_set('session.cookie_secure', true);
@ini_set('session.use_only_cookies', true);
//END Really Simple SSL
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'epiz_28910446_w269' );

/** MySQL database username */
define( 'DB_USER', '28910446_1' );

/** MySQL database password */
define( 'DB_PASSWORD', 'z7!j[pSH17' );

/** MySQL hostname */
define( 'DB_HOST', 'sql203.byetcluster.com' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'q3gz7sf6z0eh9gbszi4rtfi1myre6ajrt7f2injbykacf5meaktcrdmrnscukuub' );
define( 'SECURE_AUTH_KEY',  'ivu49dhmtiokj2osytnjs5tvllngucjipvkvsp1n3vyy5y3wdcfkxh1n4xd0es8z' );
define( 'LOGGED_IN_KEY',    'hkrvgdpmxdwzn8wstfsu15p9rkshqhnohboyibjnnsgatmpmlhnhb03kruifi2uq' );
define( 'NONCE_KEY',        'pesghrns0amivcaeq6ftgvqbadef1std0woaeencrtjq0mtiqohy6fu2ixzaonul' );
define( 'AUTH_SALT',        'ior4jh2gybxvz96wxls7zdfwlvdmswykg0ewcvjthghhyxtn7nk7mvygsieqzi4j' );
define( 'SECURE_AUTH_SALT', 'qrlmkdwgx8ktyntrcoug3xdgqkly5n04vfjjfup9qwueryacpnjydw9hiu1foskg' );
define( 'LOGGED_IN_SALT',   'qwv8slbqzzwqs0pe9ljnvbacucwisifgaejqq44smachfvr4wjtdyr4mou5e1dp9' );
define( 'NONCE_SALT',       'sdj6yoesxvkpdjqyxuamp8t6t1axy2gmdfqc9urm3ahcimsc2mxeyizvdbqf6kfm' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpgq_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
