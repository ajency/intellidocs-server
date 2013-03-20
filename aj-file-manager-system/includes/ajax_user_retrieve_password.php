<?php 
header('Content-Type: application/json');
header('Cache-Control: no-cache');

$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

function dmt_retrieve_password($user_name_or_email) {
	
	global $wpdb, $current_site;
	
	$errors = new WP_Error();
	
	if ( empty( $user_name_or_email ) ) 
	{
		return array('response' => false,'error_code' => 0); //No username
	} 
	else if ( strpos( $user_name_or_email, '@' ) ) 
	{
		$user_data = get_user_by( 'email', trim( $user_name_or_email ) );
		if ( empty( $user_data ) )
			return array('response' => false,'error_code' => 1); //Invalid Email
	} 
	else 
	{
		$login = trim($user_name_or_email);
		$user_data = get_user_by('login', $login);
	}
	if ( !$user_data ) {
		return array('response' => false,'error_code' => 2); // Invalid username or email
	}

	// redefining user_login ensures we return the right case in the email
	$user_login = $user_data->user_login;
	$user_email = $user_data->user_email;
	$user_id 	= $user_data->ID;

	$new_password = wp_generate_password();
	
	//var_dump($new_password);
	wp_set_password( $new_password, $user_id );
	
	$message = __('Someone requested that the password be reset for the following account:') . "\r\n\r\n";
	$message .= sprintf(__('Username: %s'), $user_login) . "\r\n\r\n";
	$message .= sprintf(__('Password: %s'), $new_password) . "\r\n\r\n";

	$title = sprintf( __('Password Reset') );

	$title = apply_filters('retrieve_password_title', $title);
	$message = apply_filters('retrieve_password_message', $message, $key);

	if ( $message && !wp_mail($user_email, $title, $message) )
		return array('response' => false,'error_code' => 3); //Email did not go through

	return array('response' => true,'error_code' => false);
}
function dmt_change_password($user_name,$password,$new_password)
{
	if ( !user_pass_ok($user_name,$password))
	{
		return array('response' => false,'error_code' => 0);
	}
	else
	{
		$user_data = new WP_User($user_name);
		wp_set_password( $new_password, $user_data->ID );
		
		$message = __('Someone requested that the password be reset for the following account:') . "\r\n\r\n";
		$message .= sprintf(__('Username: %s'), $user_data->user_login) . "\r\n\r\n";
		$message .= sprintf(__('Password: %s'), $new_password) . "\r\n\r\n";

		$title = sprintf( __('Password Changed') );

		if ( $message && !wp_mail($user_data->user_email, $title, $message) )
			return array('response' => true,'error_code' => 3); //Email did not go through
		
		return array('response' => true,'error_code' => false);
	}
}

$type = $_REQUEST['password_action_type'];
$user_name_or_email = $_REQUEST['user_login'];
$old_pass = $_REQUEST['old_pass'];
$new_pass = $_REQUEST['new_pass'];

if($type == 'retrieve_password')
	echo  $_REQUEST['dmt_reset_password'].'('. json_encode(dmt_retrieve_password($user_name_or_email)).')';

elseif($type == 'change_password')
	echo  $_REQUEST['dmt_change_password'].'('. json_encode(dmt_change_password($user_name_or_email,$old_pass,$new_pass)).')';

else
	echo  $_REQUEST['dmt_reset_password'].'('. json_encode(array('response' => false,'error_code' => 4)).')'; //No type found
		
ob_flush();
flush();
?>