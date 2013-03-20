<?php 
header('Content-Type: application/json');
header('Cache-Control: no-cache');

$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_get_list_deactivated_folders()
{
	global $wpdb;
	$return_data = array();
	$folders_deactivated_table  = $wpdb->prefix . "dmt_deactvated_folders";
	$deactivated_folders = $wpdb->get_results($wpdb->prepare("SELECT `folder` FROM $folders_deactivated_table"));
	if($deactivated_folders)
	{
		foreach($deactivated_folders as $folder)
		{
			$return_data[] = array('folder' => $folder->folder);
		}
	}
	return $return_data;
}
if(is_user_logged_in())
{
$event_array = array(
						'type' 		=> 	"event",
						'name'		=>	"folder_deactivated",
						'data'		=>	dmt_get_list_deactivated_folders(),
					);
}
else 
{
	$event_array = array(
			'type' 		=> 	"event",
			'name'		=>	"folder_deactivated",
			'data'		=>	array(),
	);
}
echo json_encode($event_array);

ob_flush();
flush();
?>