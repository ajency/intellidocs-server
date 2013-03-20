<?php 
header('Content-Type: application/json');
header('Cache-Control: no-cache');

$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_get_text_trimmed($content,$length)
{
	$trimmed_txt = ' [...]';
	if((strlen($content)+6) > $length)
	{
		$content = substr($content,0,$length).$trimmed_txt;
	}
	return $content;
}

function dmt_get_sitewide_messages_from_server($user_name)
{
	$message_data = array();
	$user = get_user_by('login', $user_name);
	if($user)
	{
		$excerpt_length = 200; //The number of characters in the excerpt
		$title_length = 50; //The number of characters in the excerpt
		$args = array(
						'numberposts'     => -1,
						'offset'          => 0,
						'orderby'         => 'ID',
						'order'           => 'DESC',
						'post_type'       => 'dmt_messages',
						'post_status'     => 'publish',
						'suppress_filters' => true 
						);
		$messages = get_posts($args);
		if($messages){
		foreach($messages as $message)
		{
			$message_data[] = array(
			'message_id'		=> $message->ID,
			'message_title' 	=> $message->post_title,
			'message_content' 	=> wpautop($message->post_content),
			'message_excerpt' 	=> dmt_get_text_trimmed($message->post_title,$title_length),
			'message_date'		=> wp_core_time_since(strtotime($message->post_date_gmt)),	
			);
		}}
	}
	return $message_data;
}
$callback = $_REQUEST['callback'];
if(is_user_logged_in())
	echo $callback.'('.json_encode(array('data' => dmt_get_sitewide_messages_from_server($_REQUEST['dmt_user_name']))).')';
else 
	echo $callback.'('.json_encode(array('data' => array())).')';
