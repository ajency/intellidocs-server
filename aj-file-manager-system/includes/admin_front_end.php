<?php
/**
 * function to add document folders as a column
 * @param unknown_type $defaults
 * @return multitype:
 */
function dmt_add_document_folder_column( $defaults ) {

	//get checkbox and title
	$output = array_slice( $defaults, 0, 2 );

	//splice in workflow state
	$output['document_folders'] = __( 'Folder', 'dmt-files-revs' );

	//get the rest of the columns
	$output = array_merge( $output, array_slice( $defaults, 2 ) );

	//return
	return $output;
}
add_filter( 'manage_edit-document_files_columns', 'dmt_add_document_folder_column'  );
/**
 * function to add document extention column
 * @param unknown_type $defaults
 * @return multitype:
 */
function dmt_add_document_ext_column( $defaults ) {

	//get checkbox and title
	$output = array_slice( $defaults, 0, 3 );
	
	//splice in workflow state
	$output['document_ext']	 = __( 'Type', 'dmt-files-revs' );
	$output['document_solicitor'] = __( 'Solicitor', 'dmt-files-revs' );
	$output['document_item_id'] 	 = __( 'Item ID', 'dmt-files-revs' );

	//get the rest of the columns
	$output = array_merge( $output, array_slice( $defaults, 2 ) );

	//return
	return $output;
}
add_filter( 'manage_edit-document_files_columns', 'dmt_add_document_ext_column',20  );

/**
 * Callback function to populate the column "Folder"
 */
function dmt_add_document_folder_column_cb($col_name,$post_id)
{
	if($col_name != 'document_folders')
		return;
	
	//get terms
	$folders = wp_get_post_terms( $post_id, 'document_folders' );
	
	if(sizeof($folders) == 0)
	return ;
	
	foreach ($folders as $folder)
	{
		echo '<a href="' . esc_url( add_query_arg( 'document_folders', $folder->slug) ) . '">' . $folder->name . '</a>&nbsp;&nbsp;';
	}
}
add_action( 'manage_document_files_posts_custom_column', 'dmt_add_document_folder_column_cb', 10, 2 );

/**
 * Callback function to populate the column "Type"
 */
function dmt_add_document_ext_column_cb($col_name,$post_id)
{
	if($col_name != 'document_ext')
		return;
	
	$args = array(
			'post_type' => 'attachment',
			'numberposts' => -1,
			'post_status' => null,
			'post_parent' => $post_id
	);
	$attachments = get_posts($args);
	
	if(sizeof($attachments) == 0)
		return ;
	
	$ext = dmt_get_file_extention($attachments[0]->ID);
	echo '<strong>'.$ext.'<strong>';
}
add_action( 'manage_document_files_posts_custom_column', 'dmt_add_document_ext_column_cb', 10, 2 );

/**
 * Callback function to populate the column "Solicitor" and "Item Id"
 */
function dmt_document_files_meta($col_name,$post_id)
{
	switch($col_name)
	{
		case 'document_solicitor':
				$solicitor = get_post_meta($post_id,'dmt_file_solicitor',true);
				$solicitor = ($solicitor)?$solicitor:'None';
				echo '<span class="description">'.$solicitor.'<span>';
				break;
		case 'document_item_id':
				$item_id = get_post_meta($post_id,'dmt_file_item_number',true);
				$item_id = ($item_id)?$item_id:'None';
				echo '<span class="description">'.$item_id.'<span>';
			break;
		default:
			return;
	}
}
add_action( 'manage_document_files_posts_custom_column', 'dmt_document_files_meta', 10, 2 );

/**
 * Removing admin footer text
 */
function dmt_admin_footer_text($text)
{
	/*if(dmt_current_user_is_site_admin())
	{
		return '<span id="footer-thankyou">' . __( 'Thank you for creating with <a href="http://www.ajency.in/">Ajency.in</a>.' ) . '</span>';
	}*/
	return '';
}
add_filter('admin_footer_text','dmt_admin_footer_text');

/**
 * Function to redirect admin to user profile on user add
 */
add_action("admin_init", "dmt_redirect_after_user_add");
function dmt_redirect_after_user_add() {
	if(!empty($_GET['id']) && !empty($_GET['update']) && ($_GET['update'] == 'add')) {
		$userid = $_GET['id'];
		$user = get_userdata( $userid );
		wp_redirect( admin_url("/user-edit.php?user_id=".$user->ID) );
	}
}

//////////////////////////FUNCTION TO ADD EMAIL SETTINGS SCREEN///////////////////////////
function dmt_email_notification_settings()
{
	add_options_page('Email Notification Settings', 'Email Settings', 'manage_options', 'dmt_mail_settings', 'dmt_email_notification_settings_screen');	
}
add_action('admin_menu', 'dmt_email_notification_settings');

//////////////////////////FUNCTION TO DISPLAY EMAIL SETTINGS SCREEN///////////////////////////
function dmt_email_notification_settings_screen()
{
	$user_email_settings = array();
	if(isset($_POST['nu_email_subject']))
		$user_email_settings['dmt_new_user_email_subject'] = esc_attr($_POST['nu_email_subject']);
	
	if(isset($_POST['nu_email_description']))
		$user_email_settings['dmt_new_user_email_body'] = $_POST['nu_email_description'];
	
	foreach($user_email_settings as $key => $data)
	{
		update_option($key,$data);
	}
	?>
    <div class="wrap" id="dmt_email_settings">
        <div id="icon-link-manager" class="icon32"></div>
        <h2>Email Settings</h2>
        <form action="" method="post">    
        <h3>New User Registered Email</h3>
        <table class="form-table">
            <tbody>
            <tr>
                <th><label for="nu_email_subject">Email Subject</label></th>
                <td><input type="text" name="nu_email_subject" value="<?php echo get_option('dmt_new_user_email_subject','')?>" size="80"><br>
                <span class="description">%blogname% can be used in the email subject</span></td>
            </tr>
             <tr>
                <th><label for="nu_email_description">Email Body</label></th>
                <td><textarea name="nu_email_description" id="nu_email_description" rows="5" cols="80"><?php echo get_option('dmt_new_user_email_body','')?></textarea><br>
                <span class="description">%displayname%,%firstname%,%lastname%,%username%, %password% , %blogname% or HTML can be used in the email body</span></td>
            </tr>
            </tbody>
        </table>
        <input class='button-primary' type='submit' name='Save' value='<?php _e('Save Settings'); ?>' id='submitbutton' />
        </form>
    </div>    
    <?php 
}