<?php 
header('Content-Type: application/json');
header('Cache-Control: no-cache');

$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_get_latest_notifications($user_name)
{
	global $wpdb;
	$user_notifications_table = $wpdb->prefix . "dmt_user_notifications_data";
	$data = array();
	
	$user_data = new WP_User($user_name);
	if($user_data)
	{
		$notifications = $wpdb->get_results( 
											"
												SELECT *
												FROM $user_notifications_table
												WHERE user_id = $user_data->ID
												AND status = 0 limit 50
												"
											);
																			
		foreach($notifications as $notification)
		{
			$category =  get_term_by( 'id', $notification->category_id , 'document_folders');
			$post = get_post($notification->post_id);
			
			if($notification->notification_type == 'new_file_added')
				$notification_message = "New file \"$post->post_title\" added";
			else
				$notification_message = "Updated file \"$post->post_title\"";
				
			$data[] = array( 
								post_id 			=> $notification->post_id , 
								notification_id 	=> $notification->ID,
								file_name			=> $post->post_title,
								category_id 		=> $notification->category_id,
								category_name 		=> $category->name,
								notify_message 		=> $notification_message,
								folder				=> $notification->folder
							);
		}
	}
	return $data;
}
if(is_user_logged_in())
{
	$event_array = array(
			type 		=> 	"event",
			name		=>	"new_file_added",
			data		=>	dmt_get_latest_notifications($_POST['user_name'])

	);
}
else
{
	$event_array = array(
			type 		=> 	"event",
			name		=>	"new_file_added",
			data		=>	array(),
	
	);
}
echo json_encode($event_array);

ob_flush();
flush();
?>