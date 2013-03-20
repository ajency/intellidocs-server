<?php

/**
 * Function to find the user role of current logged in user
 */
	function dmt_current_user_is_site_admin()
	{
		$user = wp_get_current_user();
		
		if ( !empty( $user->roles ) && is_array( $user->roles ) ) {
			foreach ( $user->roles as $role )
				if($role == 'dmt_site_admin')
				return true;
		}
		return false;
	}
/**
 * Disable all menu items for the user role
 * 
 */
	function dmt_hide_dashboard_menu_items()
	{
		global $menu;// For future use
		if(dmt_current_user_is_site_admin())
		{
			
			remove_menu_page('upload.php');
			remove_menu_page('edit.php');
			remove_menu_page('edit-comments.php');
			remove_menu_page('tools.php');
			
		}
	}
	add_action('admin_menu','dmt_hide_dashboard_menu_items');
/**
 * Disable all menu items for the user role from admin bar
 *
 */		
	function dmt_hide_dashboard_menu_items_admin_bar() {
		global $wp_admin_bar;
		if(dmt_current_user_is_site_admin())
		{
			
			$wp_admin_bar->remove_menu('new-post');
			$wp_admin_bar->remove_menu('new-media');
			$wp_admin_bar->remove_menu('comments');
			$wp_admin_bar->remove_menu('wp-logo');
		}
	}
	add_action( 'wp_before_admin_bar_render', 'dmt_hide_dashboard_menu_items_admin_bar' );

/**
 * function to hide screen option settings
 * @param unknown_type $show_screen
 * @return boolean
 */
function dmt_remove_screen_options($show_screen)
{
	if(dmt_current_user_is_site_admin())
	{
		return false;
	}
	return true;
}
add_filter('screen_options_show_screen','dmt_remove_screen_options');

/**
 * Remove the default dashboard widgets
 * 
 */	
function disable_default_dashboard_widgets() {

	if(dmt_current_user_is_site_admin())
	{
	remove_meta_box('dashboard_right_now', 'dashboard', 'core');
	remove_meta_box('dashboard_recent_comments', 'dashboard', 'core');
	remove_meta_box('dashboard_incoming_links', 'dashboard', 'core');
	remove_meta_box('dashboard_plugins', 'dashboard', 'core');

	remove_meta_box('dashboard_quick_press', 'dashboard', 'core');
	remove_meta_box('dashboard_recent_drafts', 'dashboard', 'core');
	remove_meta_box('dashboard_primary', 'dashboard', 'core');
	remove_meta_box('dashboard_secondary', 'dashboard', 'core');

	}
}
add_action('admin_menu', 'disable_default_dashboard_widgets');



	
	
	