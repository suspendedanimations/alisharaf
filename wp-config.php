<?php
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
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'alishara_wp');

/** MySQL database username */
define('DB_USER', 'alishara_wp');

/** MySQL database password */
define('DB_PASSWORD', 'Ali_Fajer@2014');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'T>Fku!Xjz!^3a3 ec0{k1NX#i9A7*cOSZqLc`ZF,#[vYdT0ysS[(54ugv!q&9UnX');
define('SECURE_AUTH_KEY',  '/}zd9L=%i|+=&VUi,N10GO$G=k1LRO(:~T4dj_l6P^}]66?IE)XFx!Jc9#@Vecr2');
define('LOGGED_IN_KEY',    ':#Ynmv(~aS*.D,EBk2WD5j;(:Al7--6.9Rt#kAhT!2mbWTwT6OE6G<`P65]Ncj~J');
define('NONCE_KEY',        'D/bM@Z^e1|)93|=aMccLx EDU%Y<.oG1LPw.9JeoM+9F*o/@YwTG8@WKH)9{MF)=');
define('AUTH_SALT',        '-0z8ooabt^zprBxN1UqnD|7m/OP6-?rRG|3!xpjG$W7d!qfg&ow]5_MQcUgT`znC');
define('SECURE_AUTH_SALT', 'Arf4ITMkK.J!@^!5M#BMmu,I]v/y<Xuid{VNSg7>uiG}Y=<~/9nU!;av;b>]]0$*');
define('LOGGED_IN_SALT',   'K[^f{%Z:~4$)}FR0a]Pt+k5]Cdu+vHv|D&t]+u[rCP7 |Dss);?oCk7$~O(z|^Va');
define('NONCE_SALT',       '(z)mvR_1*AS(_Wo/Zxv6{P4vV i*v]M,<}H@88/EEddsP@}BsMtr:pLN#0v?CzON');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
