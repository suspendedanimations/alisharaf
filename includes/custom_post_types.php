<?php 

    function custom_post_types() {

        work_post();
    }
    
    function work_post() {
        $labels = array(
            'name'               => _x( 'Works', 'post type general name' ),
            'singular_name'      => _x( 'Work', 'post type singular name' ),
            'add_new'            => _x( 'Add Work', 'book' ),
            'add_new_item'       => __( 'Add New Work' ),
            'edit_item'          => __( 'Edit Work' ),
            'new_item'           => __( 'New Work' ),
            'all_items'          => __( 'All Works' ),
            'view_item'          => __( 'View Work' ),
            'search_items'       => __( 'Search Works' ),
            'not_found'          => __( 'No work found' ),
            'not_found_in_trash' => __( 'No work found in the Trash' ),
            'parent_item_colon'  => '',
            'menu_name'          => 'Works'
        );
        $args = array(
            'labels'        => $labels,
            'description'   => 'Work posts',
            'public'        => true,
            'menu_position' => 5,
            'supports'      => array( 'title'),
            'has_archive'   => true,
            'rewrite' => array('slug' => 'diary', 'with_front' => false) // with_front: false overides default permalink /blog
        );
        register_post_type( 'Work', $args );
    }