<?php 
//This file contains the basic function to update the users notifications when a new file is added or updated
function dmt_recurse_find_parent($cat_id,$folder_path = '')
{
	$term = get_term_by( 'id', $cat_id , 'document_folders');
	$folder_path .= '/'.$term->name;
	
	if($term->parent != 0)
		return dmt_recurse_find_parent($term->parent,$folder_path);
	else
		return array($cat_id,$folder_path);
}
function dmt_add_notification_data($post_id,$post)
{
	global $wpdb;
	$user_access_table = $wpdb->prefix . "dmt_user_cat_access_data";
	$user_notifications_table = $wpdb->prefix . "dmt_user_notifications_data";

	$post_categories =  wp_get_post_terms( $post_id, 'document_folders');
	
	foreach($post_categories as $post_category)
	{
		$cat_id = $post_category->term_id;
		
		$cat_details = dmt_recurse_find_parent($cat_id); 
		$cat_parent  = $cat_details[0];
		$cat_folders	 = $cat_details[1];
		$cat_folder ='';
		$cat_folders = explode('/',$cat_details[1]);
		for($i = count($cat_folders); $i > 0 ; $i--)
		{
			$cat_folder .= $cat_folders[$i].'/';
		}
		$cat_folder = ltrim($cat_folder,'/');
		$users = $wpdb->get_results( 
								"
								SELECT user_id
								FROM $user_access_table
								WHERE category_id = $cat_parent
								"
							);
		if($users)
		{
			foreach($users as $user)
			{
				$notification_data = $wpdb->get_results( 
															"
															SELECT *
															FROM $user_notifications_table
															WHERE category_id = $cat_id
															AND user_id = $user->user_id
															AND post_id = $post_id
															"
															);
				if(!$notification_data)
						$wpdb->insert($user_notifications_table, array( 'post_id' => $post_id ,'user_id' => $user->user_id, 'category_id' => $cat_id ,'notification_type' => 'new_file_added','folder' => $cat_folder, 'status' => 0 ) );					
				else
				{
					
					foreach($notification_data as $row => $data)
					{ 
						if($notification_data[$row]->notification_type == 'new_file_added')
							$wpdb->update($user_notifications_table, array( 'notification_type' => 'file_updated','status' => 0),array( 'post_id' => $post_id ,'user_id' => $user->user_id, 'category_id' => $cat_id ));
						else
							$wpdb->update($user_notifications_table, array( 'notification_type' => 'file_updated','status' => 0),array( 'post_id' => $post_id ,'user_id' => $user->user_id, 'category_id' => $cat_id ));			
					}
				}
			}
		}
		
	}
}
add_action('wp_insert_post','dmt_add_notification_data',10,2);
?>