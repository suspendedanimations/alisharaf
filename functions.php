<?php
include_once 'includes/custom_post_types.php';
include_once 'includes/custom_taxonomies.php';
include_once 'includes/lib/Mobile_Detect.php';

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		} );
	return;
}

Timber::$dirname = array('views');

class Site extends TimberSite {
	
	function __construct() {
		
		show_admin_bar(false);

		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'initAction' ) );
		
		add_action( 'wp_footer', 'deregister_scripts' );

        remove_action( 'wp_head', 'rest_output_link_wp_head');
        remove_action( 'wp_head', 'wp_oembed_add_discovery_links');
        remove_action( 'template_redirect', 'rest_output_link_header', 11, 0 );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		
		remove_action('wp_head', 'wlwmanifest_link');
		remove_action('wp_head', 'index_rel_link');
		remove_action('wp_head', 'rsd_link');
		remove_action('wp_head', 'wp_generator');

		if( function_exists('acf_add_options_page') ) {
	        acf_add_options_page();
	    }

		$this->detect = new Mobile_Detect;
		
		parent::__construct();
	}

	function initAction() {
		custom_post_types();
		custom_taxonomies();
	}

	function add_to_context( $context ) {

		$context['IS_PREVIEW'] = isset($_GET["preview"]);
		$context['site'] = $this;
		
		$context['isAJAX'] = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
		$context['option'] = get_fields('option');
		
		$context['isMobile'] = $this->detect->isMobile();
		$context['isTablet'] = $this->detect->isTablet();
		
        $args = array('post_type' => 'work', 'posts_per_page' => -1, 'order_by' => 'date');
        $context['diary'] = Timber::get_posts($args);
        
		return $context;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own functions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );

		$twig->addFilter('trimWords', new Twig_Filter_Function('trimWords'));
		$twig->addFilter('ti', new Twig_Filter_Function('convertToTimberImage'));
		$twig->addFilter('downsize', new Twig_Filter_Function('downsize'));
		return $twig;
	}

}

new Site();

function trimWords($string, $len = 50){
	$text = TimberHelper::trim_words($string, $len, false);
	$last = $text[strlen($text) - 1];
	if ( $last != '.') {
		$text .= ' &hellip; ';
	}
	return $text;
}

function deregister_scripts(){
	wp_deregister_script( 'wp-embed' );
}

function convertToTimberImage($imageArray) {
	return (is_array($imageArray)) ? new TimberImage($imageArray['ID']) : '';
}

function downsize($image, $width, $height = 0){
	if(get_class($image) != 'TimberImage') { return 'downsize should be applied to a TimberImage only'; }

	$src = $image->get_src();

	$src = TimberImageHelper::img_to_jpg($src);

	if($image->width >= $width || ($height != 0 && $image->height >= $height)) {
		$src = TimberImageHelper::resize($src, $width, $height);
	}
	return $src;
}
