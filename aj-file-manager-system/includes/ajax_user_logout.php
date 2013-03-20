<?php 
header('Content-Type: application/json');

$path = $_SERVER['DOCUMENT_ROOT'];
$mypath = '';
$path = $path.$mypath;
include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

$callback = $_REQUEST['callback'];
if(is_user_logged_in())
{
	wp_clear_auth_cookie();
	echo $callback.'('.json_encode(array('result' => 'LoggedOut')).')';
}
else
{
	echo $callback.'('.json_encode(array('result' => 'AlreadyLoggedOut')).')';
}
?>