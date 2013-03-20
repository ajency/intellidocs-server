<?php 
//Function to register the globally seen messages posted by site admin

function dmt_register_message_cpt() {
  $labels = array(
    'name' => _x('Messages', 'post type general name'),
    'singular_name' => _x('Message', 'post type singular name'),
    'add_new' => _x('Add New', 'book'),
    'add_new_item' => __('Add New Message'),
    'edit_item' => __('Edit Message'),
    'new_item' => __('New Message'),
    'all_items' => __('All Message'),
    'view_item' => __('View Message'),
    'search_items' => __('Search Messages'),
    'not_found' =>  __('No messages found'),
    'not_found_in_trash' => __('No messages found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => __('Messages')

  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
    'has_archive' => true, 
    'hierarchical' => false,
    'menu_position' => null,
    'supports' => array( 'title', 'editor')
  ); 
  register_post_type('dmt_messages',$args);
}
add_action( 'init', 'dmt_register_message_cpt' ); 

//add filter to ensure the text Message, or message, is displayed when user updates a message 
function dmt_message_updated_messages( $messages ) {
  global $post, $post_ID;

  $messages['dmt_messages'] = array(
    0 => '', // Unused. Messages start at index 1.
    1 => sprintf( __('Message updated. <a href="%s">View book</a>'), esc_url( get_permalink($post_ID) ) ),
    2 => __('Custom field updated.'),
    3 => __('Custom field deleted.'),
    4 => __('Message updated.'),
    /* translators: %s: date and time of the revision */
    5 => isset($_GET['revision']) ? sprintf( __('Message restored to revision from %s'), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
    6 => sprintf( __('Message published. <a href="%s">View message</a>'), esc_url( get_permalink($post_ID) ) ),
    7 => __('Message saved.'),
    8 => sprintf( __('Message submitted. <a target="_blank" href="%s">Preview message</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
    9 => sprintf( __('Message scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview message</a>'),
      // translators: Publish box date format, see http://php.net/date
      date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ), esc_url( get_permalink($post_ID) ) ),
    10 => sprintf( __('Message draft updated. <a target="_blank" href="%s">Preview message</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
  );

  return $messages;
}
add_filter( 'post_updated_messages', 'dmt_message_updated_messages' );


//Remove view from post row actions for messages.
function dmt_remove_message_row_actions( $actions, $post )
{
  	global $current_screen;
	
	if( $current_screen->post_type != 'dmt_messages' ) return $actions;
	{
		unset( $actions['view'] );
		unset( $actions['preview'] );
	}
	return $actions;
}
add_filter( 'post_row_actions', 'dmt_remove_message_row_actions', 10, 2 );

//Function to output javascript to hide unnessary quick edit fields
function dmt_hide_messages_preview_js() 
{    
    /**
       /wp-admin/edit.php?post_type=post
       /wp-admin/edit.php?post_type=page
       /wp-admin/edit.php?post_type=cpt  == dmt_messages in this example
     */

    global $post;
    if( 'dmt_messages' != $post->post_type )
        return;
    ?>
    <script type="text/javascript">         
        jQuery(document).ready( function() {
            jQuery('div#preview-action').remove();
        });    
    </script>
    <?php
}
add_action( 'admin_head-post.php', 'dmt_hide_messages_preview_js' );
?>