<?php 
header('Content-Type: application/json');
header('Cache-Control: no-cache');

$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_update_latest_notifications($user_name)
{
	global $wpdb;
	$user_notifications_table = $wpdb->prefix . "dmt_user_notifications_data";
	$data = array();
	
	$user_data = new WP_User($user_name);
	if($user_data)
	{
		$rows_updated = $wpdb->update($user_notifications_table,array('status' => 1),array('user_id' => $user_data->ID,'status' => 0));
	}
	if($rows_updated)
		return array('response' => true);

	return array('response' => false);	
}
$response = dmt_update_latest_notifications($_REQUEST['dmt_user_name']);
if(is_user_logged_in())
	echo $_REQUEST['dmt_delete_notifications'].'('.json_encode($response).')';
else		
	echo $_REQUEST['dmt_delete_notifications'].'('.json_encode(array()).')';

ob_flush();
flush();
?>