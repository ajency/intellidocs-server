<?php 
//header('Content-Type: application/json');
$path = $_SERVER['DOCUMENT_ROOT'];
$mypath = '';
$path = $path.$mypath;
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/user.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_authenticate_user($user_name,$password,$callback_key)
{
	if ( !user_pass_ok($user_name,$password))
	{
		$authenticated =  $callback_key.'('.json_encode(array('response' => false)).')';
	}
	else
	{
		$user_data = new WP_User($user_name);
		wp_set_auth_cookie($user_data->ID);
		$authenticated =  $callback_key.'('.json_encode(array('response' => true,'email' => $user_data->user_email,'key' => md5($password))).')';
	}
	return $authenticated;
}

echo dmt_authenticate_user($_REQUEST['dmt_username'],$_REQUEST['dmt_password'],$_REQUEST['get_user_authenticated']);