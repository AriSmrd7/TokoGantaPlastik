<?php
/**
 * WP Quick Post Duplicator
 *
 *
 * @package WP Quick Post Duplicator
 * @since 1.0
 */
/**
 /**
 * Plugin Name: WP Quick Post Duplicator
 * Plugin URI:  https://wordpress.org/plugins/wp-quick-post-duplicator/
 * Description: Copy or Duplicate any post types, including pages, taxonomies & custom fields with a single click.
 * Author:      Arul Prasad J
 * Author URI:  https://profiles.wordpress.org/arulprasadj/
 * Version:     1.0
 * Text Domain: wp-quick-post-duplicator
 * Domain Path: /languages
 * License:     GPLv2 or later (license.txt)
 
 Copyright (C)  2020-2021 arulprasadj
 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.
 */
/**
* Class and Function List:
* Function list:
* - apj_duplicate_post_link()
* - apj_duplicate_post_as_a_draft()
* Classes list:
*/
function apj_duplicate_post_link($actions, $post)
{
    if (current_user_can('edit_posts'))
    {
        $actions['duplicate'] = '<a href="admin.php?action=apj_duplicate_post_as_a_draft&amp;post=' . $post->ID . '" title="Duplicate this item" rel="permalink">Duplicate This Item</a>';
    }
    return $actions;
}

$post_types = get_post_types('', 'names');

foreach ($post_types as $post_type)
{
    add_filter($post_type . '_row_actions', 'apj_duplicate_post_link', 10, 2);
}

function apj_duplicate_post_as_a_draft()
{
    global $wpdb;
    if (!(isset($_GET['post']) || isset($_POST['post']) || (isset($_REQUEST['action']) && 'apj_duplicate_post_as_a_draft' == $_REQUEST['action'])))
    {
        wp_die('No post to duplicate has been supplied!');
    }

    $apjvalue1       = intval($_GET['post']);

    $apjvalue2       = intval($_POST['post']);

    $post_id         = (isset($apjvalue1) ? $apjvalue1 : $apjvalue2);
    
    $post            = get_post($post_id);
    
    $current_user    = wp_get_current_user();
    $new_post_author = $current_user->ID;

    if (isset($post) && $post != null)
    {

        $args            = array(
            'comment_status' => $post->comment_status,
            'ping_status'    => $post->ping_status,
            'post_author'    => $new_post_author,
            'post_content'   => $post->post_content,
            'post_excerpt'   => $post->post_excerpt,
            'post_name'      => $post->post_name,
            'post_parent'    => $post->post_parent,
            'post_passworks' => $post->post_password,
            'post_status'    => 'draft',
            'post_title'     => $post->post_title,
            'post_type'      => $post->post_type,
            'to_ping'        => $post->to_ping,
            'menu_order'     => $post->menu_order
        );

        $new_post_id     = wp_insert_post($args);

        $taxonomies      = get_object_taxonomies($post->post_type);
        foreach ($taxonomies as $taxonomy)
        {
            $post_terms      = wp_get_object_terms($post_id, $taxonomy, array(
                'fields' => 'slugs'
            ));
            wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
        }

        $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post_id");
        if (count($post_meta_infos) != 0)
        {
            $main_sql_query  = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
            foreach ($post_meta_infos as $meta_info)
            {
                $meta_key        = $meta_info->meta_key;
                $meta_value      = addslashes($meta_info->meta_value);
                $sql_query_select[]                 = "SELECT $new_post_id, '$meta_key', '$meta_value'";
            }
            $main_sql_query .= implode(" UNION ALL ", $sql_query_select);
            $wpdb->query($main_sql_query);
        }

        wp_redirect(admin_url('edit.php?post_type=' . $post->post_type));
        exit;
    }
    else
    {
        wp_die('Post creation failed, could not find original post: ' . $post_id);
    }
}
add_action('admin_action_apj_duplicate_post_as_a_draft', 'apj_duplicate_post_as_a_draft');


function PluginRowMeta($links_array, $plugin_file_name)
{
    
    if (strpos($plugin_file_name, 'wp-quick-post-duplicator.php')) $links_array = array_merge($links_array, array(
        '<a target="_blank" href="https://paypal.me/arulprasadj?locale.x=en_GB"><span style="font-size: 20px; height: 20px; width: 20px;" class="dashicons dashicons-heart"></span>Donate</a>'
    ));

    return $links_array;
}

add_filter("plugin_row_meta", 'PluginRowMeta' , 1, 2);
?>
