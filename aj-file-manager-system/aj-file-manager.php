<?php
/*
Plugin Name: File And User Manager
Plugin URI: http://www.wasptech.com
Description: A document management system.
Version: 1.1.1
Author: Donal Moran
Author URI: http://www.wasptech.com
License: GPL3
*/
		

		
	 /**
	 * Registers the document custom post type
	 * @since 0.5
	 */
	function dmt_register_cpt() {

		$labels = array(
			'name'               => _x( 'Files', 'post type general name', 'dmt-files-revs' ),
			'singular_name'      => _x( 'Files', 'post type singular name', 'dmt-files-revs' ),
			'add_new'            => _x( 'Add Single File', 'document', 'dmt-files-revs' ),
			'add_new_item'       => __( 'Add New File', 'dmt-files-revs' ),
			'edit_item'          => __( 'Edit File', 'dmt-files-revs' ),
			'new_item'           => __( 'New File', 'dmt-files-revs' ),
			'view_item'          => __( 'View File', 'dmt-files-revs' ),
			'search_items'       => __( 'Search Files', 'dmt-files-revs' ),
			'not_found'          => __( 'No files found', 'dmt-files-revss' ),
			'not_found_in_trash' => __( 'No files found in Trash', 'dmt-files-revs' ),
			'parent_item_colon'  => '',
			'menu_name'          => __( 'Manage Documents', 'dmt-files-revs' ),
			'all_items'          => __( 'All Files', 'dmt-files-revs' ),
		);

		$args = array(
			'labels' => $labels,
			'public' => true,
			'publicly_queryable' => true,
			'show_ui' => true,
			'query_var' => true,
			'rewrite' => true,
			'capability_type' => 'post',
			'hierarchical' => false,
			'menu_position' => null,
			'register_meta_box_cb' => 'dmt_post_meta_box',	
			'menu_position'        => null,
			'supports'             => array( 'title', 'revisions', 'excerpt', 'custom-fields' ),
			'menu_icon'            => plugins_url( '/img/menu-icon.png', __FILE__ ),
		);

		register_post_type( 'document_files',  $args  );

	}


	/**
	 * Registers custom status taxonomy
	 * @since 0.5
	 */
	function dmt_register_ct() {

		$labels = array(
			'name'              => _x( 'Document Folders', 'taxonomy general name', 'dmt-files-revs' ),
			'singular_name'     => _x( 'Document Folder', 'taxonomy singular name', 'dmt-files-revs'),
			'search_items'      => __( 'Search Document Folders', 'dmt-files-revs' ),
			'all_items'         => __( 'All Document Folders', 'dmt-files-revs' ),
			'parent_item'       => __( 'Parent Document Folder', 'dmt-files-revs' ),
			'parent_item_colon' => __( 'Parent Document Folder:', 'dmt-files-revs' ),
			'edit_item'         => __( 'Edit Document Folder', 'dmt-files-revs' ),
			'update_item'       => __( 'Update Document Folder', 'dmt-files-revs' ),
			'add_new_item'      => __( 'Add New Document Folder', 'dmt-files-revs' ),
			'new_item_name'     => __( 'New Document Folder Name', 'dmt-files-revs' ),
			'menu_name'         => __( '', 'dmt-files-revs' ),
		);

		register_taxonomy( 'document_folders','document_files',  array(
					'hierarchical'          => true,
					'labels'                => $labels,
					'show_ui'               => true,
					'rewrite'               => false,
				)  );

	}
	
	/*
	 * Register the custom post types and taxonomies
	*/
	
	add_action('init','dmt_register_cpt');
	add_action('init','dmt_register_ct');
	
	/*
	 * Register the custom js reqiuired for media upload
	*/
	function dmt_admin_scripts() {
		
		wp_enqueue_script('media-upload');
		wp_enqueue_script('thickbox');
		wp_register_script('dmt-file-upload', WP_PLUGIN_URL.'/aj-file-manager-system/js/dmt-file-upload.js', array('jquery','media-upload','thickbox'));
		wp_enqueue_script('dmt-file-upload');
		wp_register_script('dmt-folder-edit',WP_PLUGIN_URL.'/aj-file-manager-system/js/dmt-edit-folders.js');
		wp_enqueue_script('dmt-folder-edit');
		wp_register_script('dmt-folder-groups',WP_PLUGIN_URL.'/aj-file-manager-system/js/groups.js');
		wp_enqueue_script('dmt-folder-groups');
		wp_register_script('bootstrap-js',WP_PLUGIN_URL.'/aj-file-manager-system/js/bootstrap.min.js');
		wp_enqueue_script('bootstrap-js');
		wp_register_script('jquery-ui-js',WP_PLUGIN_URL.'/aj-file-manager-system/js/jquery-ui.js');
		wp_enqueue_script('jquery-ui-js');
		wp_register_style('jquery-ui-css',WP_PLUGIN_URL.'/aj-file-manager-system/css/jquery-ui.css');
		wp_enqueue_style('jquery-ui-css');

		if(!dmt_current_user_is_site_admin())
		{
			wp_register_script('dmt-folder-tree',WP_PLUGIN_URL.'/aj-file-manager-system/js/jquery.treeview.js');
			wp_enqueue_script('dmt-folder-tree');
			wp_register_script('dmt-folder-cookie',WP_PLUGIN_URL.'/aj-file-manager-system/js/jquery.cookie.js');
			wp_enqueue_script('dmt-folder-cookie');
			wp_register_script('dmt-folder-atooltip',WP_PLUGIN_URL.'/aj-file-manager-system/js/jquery.atooltip.min.js');
			wp_enqueue_script('dmt-folder-atooltip');
			//wp_register_script('dmt-structure',WP_PLUGIN_URL.'/aj-file-manager-system/js/dmtFolderStructureModel.js');
			//wp_enqueue_script('dmt-structure');
		}
	}
	
	/*
	 * Function to display publish/unpublish document folder.
	*/
	function dmt_add_publish_unpublish_folder()
	{
		global $tag,$wpdb;
		$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
		$status = $wpdb->get_var($wpdb->prepare("SELECT `status` FROM $folder_status_table WHERE `folder_id` = %d",$tag->term_id));
		$unpub = (!$status || $status == 'unpublished')?'selected' : '';
		$pub = ($status && $status == 'published')?'selected' : '';
		
		 $nested_args= array(
			'descendants_and_self' => 0,
			'popular_cats' => false,
			'taxonomy' => 'document_folders',
			'checked_ontop' => false,
		); 
	?>
		<tr class="form-field">
			<th scope="row" valign="top"><label for="document_folders_item_id"><?php _ex('Item Number', 'Taxonomy Description'); ?></label></th>
			<td>  
       			<input type="text" name="document_folders_item_id" id="document_folders_item_id" value="<?php echo dmt_get_document_folder_meta($_GET['tag_ID'],'document_folders_item_id');?>" style="width:130px;"/>
            	<span class="description dmtdesc"><?php _e('Enter the item number for the folder. This will be used for sorting later.'); ?></span>
            </td>
		</tr>
    	<tr class="form-field">
			<th scope="row" valign="top"><label for="description"><?php _ex('Publish', 'Taxonomy Description'); ?></label></th>
			<td>  
            <div class="custom-radio-container small-lm">
                <div class="dmtOptionSelect <?php echo $pub ?>">Publish</div>
                <div class="dmtOptionSelect <?php echo $unpub ?>">Unpublish</div>
         	</div>
           <span style="line-height:31px;" > <input type="checkbox" id="apply_recursively" value="yes" style="width:5%; margin-right:-10px" >Apply Recursively</span>
            <!-- Publish Email Settings -->
         	<a href="#TB_inline?height=500&width=600&inlineId=hiddenEmailContent" class="thickbox" id="dmtPublishSendEmail" style="display:none;">Send Email</a>
            
            <div id="hiddenEmailContent" style="display:none;">
            <h1>Publish Settings</h1><hr>
            	<h3>Send Email Notification</h3>
            	<span class="description">Send email notification to all the users who have access to this folder.</span><br>
           		<label for="dmtSendEmailsYes"><input id="dmtSendEmailsYes" type="radio" name="dmt_send_emails" value="yes" />&nbsp;Yes</label><br>
            	<label for="dmtSendEmailsNo"><input id="dmtSendEmailsNo" type="radio" name="dmt_send_emails" value="no" checked="checked"/>&nbsp;No</label><br>
            	
            	<div class="dmtPublishSettingsPublishWrapper" style="position:absolute;bottom:20px;">
            		<a class="button-secondary" id="dmtPublishSettingsPublish" href="" title="Publish Folder">Publish Folder</a>
            	</div>
            </div>
            <!-- End Publish Email Settings -->
            
            <div class="dmtAjaxSpinner" id="dmt_folder_publish_spinner" style="display:none;"></div>
			<div class="clearfix"></div>
            <span class="description dmtdesc"><?php _e('Publish this folder.'); ?></span>
            </td>
            <input type="hidden" name="dmt_folder_term_id" id="dmt_folder_term_id" value="<?php echo $tag->term_id ?>" />
            <input type="hidden" name="dmt_folder_status" id="dmt_folder_status" value="<?php echo $status?>" />
            <input type="hidden" name="dmt_folder_parent_id" id="dmt_folder_parent_id" value="<?php echo $tag->parent ?>" />
		</tr>
        <tr class="form-field">
			<th scope="row" valign="top"><label for="description"><?php _ex('Folder Options', 'Taxonomy Description'); ?></label></th>
			<td>
            <div class="custom-radio-container small-lm">
                <div class="dmtFolderOptionSelect">Copy</div>
                <div class="dmtFolderOptionSelect" style="border-left: 1px solid #CCC;">Activate/Deactivate</div>
         	</div>
            
            <div class="clearfix"></div>
            <span class="description dmtdesc"><?php _e('Edit options pertaining to this folder.'); ?></span>
                 
            <div id="dmtFolderCopy" style="display:none;">
           		<div class="dmtFolderList">
					<ul class="parents">
						<?php wp_terms_checklist(0, $nested_args);?>
                 	</ul>
                 </div> 
                 <div class="dmtFolderCopyButton" id="dmtFolderCopyButton">Copy to selected folder &gt;&gt;</div>
                 <div class="dmtAjaxSpinner" id="dmt_folder_copy_spinner" style="display:none;"></div>
                 <span class="description dmtdesc"><?php _e('Only files other than the ones common to the folder will be copied.'); ?></span>
            </div>
            
            <div id="dmtFolderDeactivate" style="display:none;">
            <?php $folder_activation_staus = (dmt_check_folder_is_deactivated($tag->term_id))?'Activate Folder':'Deactivate Folder'; ?>
                 <div class="dmtFolderCopyButton" id="dmtFolderDeactivateButton"><?php echo $folder_activation_staus;?></div>
                 <div class="dmtAjaxSpinner" id="dmt_folder_deactivate_spinner" style="display:none;"></div>
                 <span class="description dmtdesc"><?php _e('Note: Once folder is deactivated, all the files in the folder will be deleted from clients device. Publishing the folder again will make the folder visible on the deivce.'); ?></span>
            </div>
            </td>
		</tr>
		
		<tr class="form-field">
			<th scope="row" valign="top"><label for="description"><?php _ex('Actions', 'Taxonomy Description'); ?></label></th>
			<td>  
            <div class="custom-radio-container small-lm">
                <div class="dmtOptionDelete deleteaction">Delete</div> 
         	</div>
           <span style="line-height:31px;" > <input type="checkbox" id="applydelete_recursively" value="yes" style="width:5%; margin-right:-10px" >Apply Recursively</span>
            <!-- Publish Email Settings -->
         	 <div class="dmtAjaxSpinner" id="dmt_folder_delete_spinner" style="display:none;" ></div> 
            <input type="hidden" name="delete_redirect" id="delete_redirect" value="<?php echo admin_url( 'edit.php?post_type=document_files&page=intellidocs-document-files', 'http' );?>">
		</tr>
       
	<?php 
	}
	add_action('document_folders_edit_form_fields','dmt_add_publish_unpublish_folder');
	
	function dmt_save_document_folder_meta($folder_id)
	{
		global $wpdb;
		$folder_meta_table = $wpdb->prefix . "dmt_document_folders_meta";
		
		$item_number = $_POST['document_folders_item_id'];
		
		$record_exists = $wpdb->get_var($wpdb->prepare("SELECT count(meta_value) FROM $folder_meta_table WHERE `folder_id` = %d AND `meta_key` = %s ",$folder_id,'document_folders_item_id'));
		
		if(intval($record_exists) >1)
		{
			$wpdb->delete(
					$folder_meta_table, 
					array( 'folder_id'  => $folder_id,'meta_key' => 'document_folders_item_id' )
			);
			$record_exists = 0;
		}
		 
		if(!intval($record_exists))
		{
			 
			$rows_affected = $wpdb->insert(
					$folder_meta_table,
					array(
							 'folder_id' => $folder_id,
							 'meta_value' => $item_number,
							 'meta_key' => 'document_folders_item_id'
					));
		}
		else
		{
			 
			$rows_affected = $wpdb->update(
					$folder_meta_table,
					array( 'meta_value' => $item_number),
					array( 'folder_id'  => $folder_id,'meta_key' => 'document_folders_item_id' )
			);
		}
		wp_redirect( site_url('wp-admin/edit.php?post_type=document_files&page=intellidocs-document-files') );
		exit();
 
	}
	add_action( 'edited_document_folders', 'dmt_save_document_folder_meta' );
	
	function dmt_get_document_folder_meta($folder_id,$key)
	{
		global $wpdb;
		$folder_meta_table = $wpdb->prefix . "dmt_document_folders_meta";
		$record = $wpdb->get_var($wpdb->prepare("SELECT `meta_value` FROM $folder_meta_table WHERE `folder_id` = %d AND `meta_key` = %s ",$folder_id,$key));
		return $record;
	}
	
	/*
	 * Function to check if document folder is published/unpublished.
	*/		
	function dmt_check_folder_status_is_published($folder_id)
	{
		global $wpdb;
		$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
		$status = $wpdb->get_var($wpdb->prepare("SELECT `status` FROM $folder_status_table WHERE `folder_id` = %d",$folder_id));
		if($status && $status == 'published')
			return true;
		
		return false;	
	}
	
	/*
	 * Function to check if document folder status exists.
	*/		
	function dmt_check_folder_status_exists($folder_id)
	{
		global $wpdb;
		$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
		$status = $wpdb->get_var($wpdb->prepare("SELECT `status` FROM $folder_status_table WHERE `folder_id` = %d",$folder_id));
		if(!empty($status))
			return true;
		
		return false;	
	}
	
	/*
	 * Function to check if document folder is deactivated.
	*/		
	function dmt_check_folder_is_deactivated($folder_id)
	{
		global $wpdb;
		$folders_deactivated_table  = $wpdb->prefix . "dmt_deactvated_folders";
		$status = $wpdb->get_var($wpdb->prepare("SELECT `folder_id` FROM $folders_deactivated_table WHERE `folder_id` = %d",$folder_id));
		if(!empty($status))
			return true;
		return false;	
	}
	/*
	 * Function to find the absolute parent of a particular document folder.
	*/	
	function dmt_recursive_check_find_parent_folder($folder_id)
	{
		$current_cat = get_term_by( 'id', $folder_id , 'document_folders');	
		
		if($current_cat->parent != 0)	
			$result = dmt_recursive_check_find_parent_folder($current_cat->parent);	
	
		if($result)	
			return $result;
		
		return $current_cat->term_id;
	}
	/*
	 * Function to find the users who have access to a particular folder via direct access / group membership.
	*/	
	function dmt_find_user_with_access_to_folder($folder_id)
	{	
		global $wpdb;
		$parent_folder = dmt_recursive_check_find_parent_folder($folder_id);
		$user_access_table = $wpdb->prefix . "dmt_user_cat_access_data";
		//included group related tables
		$user_group_table = $wpdb->prefix . "dmt_user_group";
		$group_folder_table = $wpdb->prefix . "dmt_group_folder";
		//commented query of only direct access
		//$users = $wpdb->get_results( $wpdb->prepare("SELECT `user_id` FROM $user_access_table WHERE `category_id` = %d",$parent_folder));
		$users = $wpdb->get_results("SELECT `user_id` 
									FROM $user_access_table 
									WHERE `category_id` = $parent_folder 
									UNION 
									SELECT user_id 
									FROM $user_group_table, $group_folder_table 
									WHERE  $user_group_table.group_id = $group_folder_table.group_id and folder_id = $parent_folder" );
		return $users;	
	}
	/*
	 * Function to send users email based on provided id.
	*/		
	function dmt_send_emails_to_users($user_id,$subject,$message)
	{
		$user_data = get_userdata($user_id);	
		add_filter('wp_mail_content_type',create_function('', 'return "text/html";'));
		$headers[] = 'From: Intellidocs.net <notifications@intellidocs.net>';
		wp_mail($user_data->user_email, $subject, $message,$headers);
	}
	
	if( ! function_exists('wp_new_user_notification') ) {
		function wp_new_user_notification( $user_id, $plaintext_pass='' )
		{
			$user_data = get_userdata($user_id);
			$displayname 	= $user_data->display_name;
			$username 		= sprintf(__('Username: %s'), $user_data->user_login) . "\r\n";
			$password  		= sprintf(__('Password: %s'), $plaintext_pass) . "\r\n";
			$blogname 		= wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
			
			if($plaintext_pass == '')
				return;
				
			//Deafults
			$message  = sprintf(__('Username: %s'), $user_data->user_login) . "\r\n";
	        $message .= sprintf(__('Password: %s'), $plaintext_pass) . "\r\n";	
			
			$subject = get_option('dmt_new_user_email_subject','Your username and password');
			$message = get_option('dmt_new_user_email_body',$message);
			
			//From custom settings
			$message = str_replace('%displayname%',$displayname,$message);
			$message = str_replace('%firstname%',$user_data->first_name,$message);
			$message = str_replace('%lastname%',$user_data->last_name,$message);
			$message = str_replace('%username%',$username,$message);
			$message = str_replace('%password%',$password,$message);
			$message = str_replace('%blogname%',$blogname,$message);
			
			add_filter('wp_mail_content_type',create_function('', 'return "text/html";'));
			$headers[] = 'From: Intellidocs.net <notifications@intellidocs.net>';
			wp_mail($user_data->user_email, $subject, $message,$headers);	 		
		}
	}
	
	/*
	 * Function to update the status of a document folder via ajax.
	*/	
	function dmt_ajax_folder_status_update()
	{
		global $wpdb;
		$folder_id 	= $_POST['folder_id'];
		$status		= $_POST['status'];	
		$apply_recursively = isset($_POST['apply_recursively'])?$_POST['apply_recursively']:'no';
		//Check if send mail is checked.
		$send_mail	= (isset($_POST['send_mail']))?$_POST['send_mail']:false; 
		
		$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
		$folders_deactivated_table  = $wpdb->prefix . "dmt_deactvated_folders";
		
		$folder_status = $wpdb->get_var($wpdb->prepare("SELECT `status` FROM $folder_status_table WHERE `folder_id` = %d",$folder_id));
		if(!$folder_status)
		{
			$rows_affected = $wpdb->insert( 
							$folder_status_table, 
							array( 
								'folder_id' => $folder_id, 
								'status' => $status	 
							)); 
		}
		else
		{
			$rows_affected = $wpdb->update( 
						$folder_status_table, 
						array( 'status' => $status), 
						array( 'folder_id' => $folder_id )
						);
		}
		if($rows_affected && $status == 'published')
		{
			$wpdb->query($wpdb->prepare("DELETE FROM $folders_deactivated_table WHERE `folder_id` = %d", $folder_id));
			
			$folder_details = dmt_recurse_find_parent_2($folder_id);
			$folder_path  	= dmt_get_folder_structure_files($folder_details );
			$folders 		= explode('/',$folder_path);
			$count			= count($folders) - 1;
			$current_folder = $folders[$count];
			unset($folders[$count]);
			$folder_path    = implode('/',$folders);
			
			$folder_path	= ($folder_path == '')?'Root/': $folder_path;
			
			$subject 	= "New folder has been published on Intellidocs.net .";
			$message 	= "<p>Dear user,</p>";
			$message   .= "<p> A new folder \"{$current_folder}\" has been published by the site admin under {$folder_path}</p>";
			
			//Only send mail if send mail is checked.
			if($send_mail && ($send_mail == 'yes'))
			{
				$email_users = dmt_find_user_with_access_to_folder($folder_id);
				foreach($email_users as $email_user)
				{
					dmt_send_emails_to_users($email_user->user_id,$subject,$message);
				}
			}
		}
		
		//Function called to recurrsively update
		if($apply_recursively=="yes")
		{
		  dmt_wp_update_sub_folders('document_folders',$folder_id,0,$status);
		}
		
		$success = ($rows_affected)?true:false;
		$response = json_encode( array( 'success' => $success,'folder_id' => $folder_id,'status' => $status,'message' => $message) );
		header( "Content-Type: application/json" );
		echo $response;
		exit;
		
	}
	add_action('wp_ajax_dmt_ajax_folder_status_update', 'dmt_ajax_folder_status_update');
	
	
	function dmt_ajax_folder_deactivate()
	{
		global $wpdb;
		$folder_id 		= $_POST['folder_id'];
		$folder_action 	= $_POST['folder_action'];
		
		$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
		$folders_deactivated_table  = $wpdb->prefix . "dmt_deactvated_folders";
		
		$temp_folder = dmt_recurse_find_parent($folder_id);
		$final_folder = dmt_get_folder_structure_files($temp_folder);
		
		if($folder_action == 'deactivate')
		{
			if(dmt_check_folder_status_exists($folder_id))
				$rows_affected = $wpdb->update( $folder_status_table,array( 'status' => 'unpublished'),array( 'folder_id' => $folder_id ));
			
			$rows_affected = $wpdb->insert($folders_deactivated_table, array( 'folder_id' => $folder_id, 'folder' => $final_folder)); 
		}
		else if($folder_action == 'activate')
		{
			$rows_affected = $wpdb->query($wpdb->prepare("DELETE FROM $folders_deactivated_table WHERE `folder_id` = %d", $folder_id));
		}
		$success = ($rows_affected)?true:false;
		$response = json_encode( array( 'success' => $success,'folder_id' => $folder_id,'folder' => $final_folder ,'folder_action' => $folder_action) );
		header( "Content-Type: application/json" );
		echo $response;
		exit;
	}
	add_action('wp_ajax_dmt_ajax_folder_deactivate', 'dmt_ajax_folder_deactivate');
	
	
	

	function dmt_ajax_create_sub_folder()
	{
		if(current_user_can('manage_options')||dmt_get_current_user_role() =="dmt_site_admin" ||   current_user_can('administrate')){ 
	
		$folder_name 		= $_POST['folder_name'];
		$parent_folder 		= $_POST['parent_folder'];
		$folder_desc 		= $_POST['folder_desc']; 
		global $wpdb;
		global $user_ID;
		$slug = sanitize_title($folder_name);
		
		$term_data = wp_insert_term( $folder_name, 'document_folders',  array(
				'description'=> $folder_desc,
				'slug' => $slug,
				'parent'=> $parent_folder
		) );
 			$success =  true;
 			if($parent_folder==0)
			{
				$table_name = $wpdb->prefix . "dmt_user_cat_access_data";
				$wpdb->insert( $table_name, array( 'user_id' => $user_ID, 'category_id' => $term_data['term_id'] ) );
			}
 		}
 		else
 		{

 			$success =  false;
 		}
		$response = json_encode( array( 'success' => $success ) );
		header( "Content-Type: application/json" );
		echo $response;
		exit;
	}
	add_action('wp_ajax_dmt_ajax_create_sub_folder', 'dmt_ajax_create_sub_folder');
	
	
	function dmt_ajax_folder_delete()
	{
		global $wpdb;
		
		$folder_dmt_group_folder = $wpdb->prefix . "dmt_group_folder";
		
		$folders_dmt_deactvated_folders  = $wpdb->prefix . "dmt_deactvated_folders";
		
		$folders_dmt_folder_visibility_status  = $wpdb->prefix . "dmt_folder_visibility_status";
		
		$folders_dmt_document_folders_meta  = $wpdb->prefix . "dmt_document_folders_meta";

		$table_name = $wpdb->prefix . "dmt_user_cat_access_data";
		
		$folder_id 		= $_POST['folder_id']; 
		$recursive 		= $_POST['recursive']; 
		if($recursive=="yes")
		{
			$termchildren = get_term_children( $folder_id, 'document_folders' );
			foreach ( $termchildren as $child ) 
			{ 
				wp_delete_term( $child, 'document_folders' );
				

				$wpdb->query($wpdb->prepare("DELETE FROM $folder_dmt_group_folder WHERE `folder_id` = %d", $child));
				
				$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_deactvated_folders WHERE `folder_id` = %d", $child));
				
				$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_folder_visibility_status WHERE `folder_id` = %d", $child));
				
				$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_document_folders_meta WHERE `folder_id` = %d", $child));

				$wpdb->query($wpdb->prepare("DELETE FROM $table_name WHERE `category_id` = %d", $child));
			}
		}
		wp_delete_term( $folder_id, 'document_folders' );
		
		$wpdb->query($wpdb->prepare("DELETE FROM $folder_dmt_group_folder WHERE `folder_id` = %d", $folder_id));
		
		$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_deactvated_folders WHERE `folder_id` = %d", $folder_id));
		
		$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_folder_visibility_status WHERE `folder_id` = %d", $folder_id));
		
		$wpdb->query($wpdb->prepare("DELETE FROM $folders_dmt_document_folders_meta WHERE `folder_id` = %d", $folder_id));

		$wpdb->query($wpdb->prepare("DELETE FROM $table_name WHERE `category_id` = %d", $folder_id));
		
		$success =  true;
		$response = json_encode( array( 'success' => $success,'folder_id' => $folder_id ,'terms'=>$termchildren,'recursive'=>$recursive) );
		header( "Content-Type: application/json" );
		echo $response;
		exit;
	}
	add_action('wp_ajax_dmt_ajax_folder_delete', 'dmt_ajax_folder_delete');
	
	function dmt_get_folder_structure_files($cat_details)
	{
		$cat_folders	 = $cat_details[1];
		$cat_folder ='';
		$cat_folders = explode('/',$cat_details[1]);
		for($i = count($cat_folders); $i > 0 ; $i--)
		{
			$cat_folder .= $cat_folders[$i].'/';
		}
		$cat_folder = ltrim($cat_folder,'/');
		$cat_folder = rtrim($cat_folder,'/');
		return $cat_folder;
	}
	function dmt_recurse_find_parent_2($cat_id,$folder_path = '')
	{
		$term = get_term_by( 'id', $cat_id , 'document_folders');
		$folder_path .= '/'.$term->name;
		
		if($term->parent != 0)
			return dmt_recurse_find_parent_2($term->parent,$folder_path);
		else
			return array($cat_id,$folder_path);
	}
	/*
	 * Function to copy contents of one folder to another  ajax.
	*/
	function dmt_ajax_folder_copy()
	{
		$current_folder 	= $_POST['folder_id'];
		$copy_folders		= $_POST['copy_folders'];
		
		$files_in_current_folder = dmt_get_files_in_folder($current_folder);
		if(!empty($files_in_current_folder))
		{
			foreach($files_in_current_folder as $file)
			{
				$previous_folders = dmt_get_file_folders($file->ID);
				$final_folders = array_merge($previous_folders, $copy_folders);
				$final_folders = array_map('intval', $final_folders);
    			$final_folders = array_unique( $final_folders );
				wp_set_object_terms( $file->ID, $final_folders, 'document_folders');
			}
		}
		$response = json_encode( array( 'success' => true ,'folder_id' => $current_folder,'copied_to' => $copy_folders) );
		header( "Content-Type: application/json" );
		echo $response;
		exit;
	}
	add_action('wp_ajax_dmt_ajax_folder_copy', 'dmt_ajax_folder_copy');
	
	/*
	 * Function to get all the files belonging to a particular folder.
	*/
	function dmt_get_files_in_folder($folder_id)
	{
		$files_args = array(
				'numberposts'     => -1,
				'offset'          => 0,
				'orderby'         => 'post_date',
				'order'           => 'DESC',
				'post_type'       => 'document_files',
				'post_status'     => 'publish',
				'tax_query'		  => array(
						
						array(
								'taxonomy' => 'document_folders',
								'field' => 'id',
								'terms' => $folder_id,
								'include_children' => false,
								)
						
						),	
				);

		$files = get_posts($files_args);
		return $files;
	}
	
	function dmt_get_file_folders($file_id)
	{
		$product_terms = wp_get_object_terms($file_id, 'document_folders');
		$folders = array();
		if(!empty($product_terms))
		{
  			if(!is_wp_error( $product_terms ))
			{
				foreach($product_terms as $term)
				{
					$folders[] = $term->term_id;
				}
			}
		}
		return $folders;
	}
	
	function dmt_admin_styles() {
		wp_enqueue_style('thickbox');
	}
	
	add_action('admin_print_scripts', 'dmt_admin_scripts');
	add_action('admin_print_styles', 'dmt_admin_styles');
		
/**
 * Add the meta box to add files to a post
 */	
	function dmt_post_meta_box()
	{
		remove_meta_box('postexcerpt', 'document_files', 'normal');
		remove_meta_box('commentstatusdiv', 'document_files', 'normal');
		remove_meta_box('postcustom', 'document_files', 'normal');
		remove_meta_box('commentstatusdiv', 'document_files', 'normal');
		remove_meta_box('commentsdiv', 'document_files', 'normal');
		remove_meta_box('revisionsdiv', 'document_files', 'normal');
		remove_meta_box('authordiv', 'document_files', 'normal');
		add_meta_box( 'dmt-file-upload-screen', 'Uploaded File', 'dmt_file_upload_meta_box', 'document_files', 'normal', 'high' );
		add_meta_box( 'dmt-file-meta-screen', 'File Meta', 'dmt_custom_file_meta_box', 'document_files', 'normal', 'high' );
	}
	function dmt_file_upload_meta_box($post)
	{
			$args = array(
					'post_type' => 'attachment',
					'numberposts' => -1,
					'post_status' => null,
					'post_parent' => $post->ID
					);
			$attachments = get_posts($args);?>
		
		<?php if(!$attachments):?>
        <div id="container">
            <div id="filelist"></div>
          	<div class="clearfix" style="margin-top:10px;"></div>
            <a id="pickfiles" class="button-secondary" href="#">Select file</a>
            <a id="uploadfiles" class="button-primary" href="#">Upload &amp; Publish file</a>
            <img src="<?php echo admin_url();?>/images/wpspin_light.gif" class="dmt-ajax-loading-file" id="ajax-loading" alt="" style="display:none;">
        </div>
        <?php include dirname( __FILE__ ) . '/includes/single_plupload_js.php';?>
        <?php else:?>
		<?php dmt_get_post_attachments($post->ID);?>
        <?php endif;?>
		<div class="clear"></div>	
	<?php 
	}
	/**
 	* Function to add the custom file meta box.
 	*/	
	function dmt_custom_file_meta_box( $post ) {

	  // Use nonce for verification
	  wp_nonce_field( plugin_basename( __FILE__ ), 'dmt_custom_file_meta' );
	  $solicitor = get_post_meta($post->ID,'dmt_file_solicitor',true);
	  $item_num	 = get_post_meta($post->ID,'dmt_file_item_number',true);	
	?>
    <table class="widefat dmtFileMetaTable">
    <thead>
        <tr>
            <th style="border-right: 1px solid #ccc;">Name of Solicitor</th>       
            <th>Item Number</th>
        </tr>
    </thead>
    <tbody>
       <tr>
         <td style="border-right: 1px solid #ccc;"><input class="dmtFileMetaField" type="text" id="dmt-name-of-solicitor" name="dmt_name_of_solicitor" value="<?php echo $solicitor;?>" size="50" /></td>
         <td><input class="dmtFileMetaField" type="text" id="dmt-item-number" name="dmt_item_number" value="<?php echo $item_num;?>" size="25" /></td>
       </tr>
    </tbody>
    </table>
        <table class="widefat dmtFileMetaTable">
    <thead><tr><th>Description</th></tr></thead>
    <tbody>
       <tr>
         <td><textarea rows="1" class="dmt_meta_excerpt" cols="40" name="excerpt" tabindex="6" id="excerpt"><?php echo $post->post_excerpt;?></textarea></td>
       </tr>
    </tbody>
    </table>
    <?php 
	$admin_url = admin_url( 'edit.php?post_type=document_files', 'http' );
	echo  '<input type="hidden" name="dmt_files_admin_url" id="dmt_files_admin_url" value="'.$admin_url.'">';
	}
	/**
 	* Function to save the custom file meta box.
 	*/	
	function dmt_save_custom_file_meta_box( $post_id ) 
	{
	  	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
		  return;
		  
  		//if ( !wp_verify_nonce( $_POST['dmt_custom_file_meta']) )
     	//return;  
 		 
		 // Check permissions
		  if ( 'page' == $_POST['post_type'] ) 
		  {
			if ( !current_user_can( 'edit_page', $post_id ) )
				return;
		  }
		  else
		  {
			if ( !current_user_can( 'edit_post', $post_id ) )
				return;
		  }

		global $wpdb;
  		$solicitor 		= esc_attr($_POST['dmt_name_of_solicitor']);
		$item_number 	= esc_attr($_POST['dmt_item_number']);
		$desc 			= esc_attr($_POST['dmt_file_desc']);
		
		$post = get_post($post_id);
		if ($post->post_type != 'revision')
		{
			update_post_meta($post_id,'dmt_file_solicitor',$solicitor);
	  		update_post_meta($post_id,'dmt_file_item_number',$item_number);
			$wpdb->update( $wpdb->posts, array('post_excerpt' => $desc),array( 'ID' => $post_id ));
		}
	}	
	add_action( 'save_post', 'dmt_save_custom_file_meta_box' );
/**
 * FUNCTION TO GET THE ATTACHMENTS FOR A FILE/POST
 */
		function dmt_get_post_attachments($post_id)
		{
			$args = array(
					'post_type' => 'attachment',
					'numberposts' => -1,
					'post_status' => null,
					'post_parent' => $post_id
					);
			$attachments = get_posts($args);

			if($attachments){
				
				$top_html .= '<table class="widefat dmtFileRow" id="dmt_file_uploads_table">
				<thead>
				<tr><th>File Name</th><th>Type</th><th>Delete</th></tr>
				</thead><tbody>';
				$count = count($attachments);
				foreach($attachments as $attachment)
				{
					
					if(isset($_GET['dmt_att_id']) && ($_GET['dmt_att_id']== $attachment->ID))
					{
						wp_delete_attachment( $attachment->ID,true );
						$count--;
					}
					else
					{
						//Add the admin url along with the all files post type.
						$admin_url = admin_url( 'edit.php?post_type=document_files', 'http' );
						
						$html .= '<tr id="dmt_file_table_row">';
						$html .= '<td height="30">'.$attachment->post_title.'</td>';
						$html .= '<td height="30">'.dmt_get_file_extention($attachment->ID).'</td>';
						$html .= '<td height="30">'.'<input type="button" id="dmt_attachment_'. $attachment->ID.'" name="upload_media_button_name" class="button-secondary" value="Delete File" onClick="dmt_delete_file(\''.$post_id.'\',\''.$attachment->ID.'\',\''.$admin_url.'\')"/>'.'</td>';
						$html .= '</tr>';
						
					}
				}
				$bottom_html .= '</tbody>';
				$bottom_html .= '</table>';
				$bottom_html .= '<div class="dmtDeletingFile" style="display:none;"><span class="dmtDeletingFileGif">&nbsp;</span><span class="dmtFileDeletedText">Deleting File</span></div>';
				
				$bottom_html .= '<input type="hidden" id="dmt_ajax_hidden_url" name="dmt_ajax_hidden_url" value="'.plugins_url('/includes/ajax_file.php', __FILE__ ).'" />';
				if($count>0)
				{
					echo $top_html.$html.$bottom_html;
				}
			}
		}
		
	

/**
 * Function to get file extention based on attachment id
 */
	function dmt_get_file_extention($attachment_id){
		
			$file = get_attached_file( $attachment_id);
			$extension = '.' . pathinfo( $file, PATHINFO_EXTENSION );
		
			//don't return a . extension
			if ( $extension == '.' )
				return '';
		
			return apply_filters( 'document_extension', $extension, $file );
		
	}
/**
 * Adds CSS to the header to hide screen options and help
 */
	function dmt_admin_hide_css_enqueue()
	{
		if(dmt_current_user_is_site_admin())
		{
			wp_register_style( 'dmt-hide-style',  plugins_url('/css/admin.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-hide-style' );

			wp_register_style( 'dmt-manage-folder-bootstrap',  plugins_url('/css/bootstrap.min.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-manage-folder-bootstrap' );
			
		
		}
		wp_register_style( 'dmt-plugin-style',  plugins_url('/css/dmt_plugin.css', __FILE__ ) );
		wp_enqueue_style( 'dmt-plugin-style' );

		if(!dmt_current_user_is_site_admin())
		{
 
			wp_register_style( 'dmt-manage-folder-bootstrap',  plugins_url('/css/bootstrap.min.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-manage-folder-bootstrap' );
			
			
			wp_register_style( 'dmt-manage-folder-treeview',  plugins_url('/css/jquery.treeview.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-manage-folder-treeview' );

			wp_register_style( 'dmt-manage-folder-atooltip',  plugins_url('/css/atooltip.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-manage-folder-atooltip' );

			wp_register_style( 'dmt-manage-folder-custom',  plugins_url('/css/dmtFolderManager.css', __FILE__ ) );
			wp_enqueue_style( 'dmt-manage-folder-custom' );
			
		}
		
	wp_enqueue_style ( 'pp_plupload_css',plugins_url('/css/jquery.plupload.queue.css', __FILE__) );	
	wp_enqueue_style ( 'pp_plupload_css',plugins_url('/css/custom.css', __FILE__) );	
	}
	add_action( 'admin_enqueue_scripts', 'dmt_admin_hide_css_enqueue' );
	
/*
 * Function to enqueue particular script for a particular page.
 */	
	function dmt_admin_hide_js_enqueue($hook) {
		
		if(dmt_current_user_is_site_admin())
		{
			if( 'user-edit.php' == $hook || 'profile.php' == $hook)
			{
				wp_register_script('dmt-hide-profile-fields', plugins_url('/js/hide_user_fields.js', __FILE__ ));
				wp_enqueue_script('dmt-hide-profile-fields');
			}

			if( 'user-new.php' == $hook)
			{
				wp_register_script('dmt-hide-profile-fields-add-user', plugins_url('/js/hide_add_new_user_fields.js', __FILE__ ));
				wp_enqueue_script('dmt-hide-profile-fields-add-user');
			}
			
		
		}
	}
	add_action( 'admin_enqueue_scripts', 'dmt_admin_hide_js_enqueue' );
	
/**
 * Function to change the rewrite rules for the custom post type.
 */
	function my_rewrite_flush() {
	
		dmt_register_cpt();

		flush_rewrite_rules();
	}
	register_activation_hook( __FILE__, 'my_rewrite_flush' );
	/**
	 * Create the necessary tables to handle notifications to the user from the website
	 */	
	 function dmt_create_notifications_table()
	 {
		 global $wpdb;
		 $table_name = $wpdb->prefix . "dmt_user_cat_access_data";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
			   $create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
					  ID mediumint(9) NOT NULL AUTO_INCREMENT,
					  user_id bigint(255) NOT NULL,
					  category_id bigint(255) NOT NULL,
					  UNIQUE KEY ID (ID)
						);";

  				 require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  				 dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_user_notifications_data";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
			   $create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
					  ID mediumint(9) NOT NULL AUTO_INCREMENT,
					  post_id bigint(255) ,
					  user_id bigint(255) NOT NULL,
					  category_id bigint(255) NOT NULL,
					  notification_type varchar(255) NOT NULL,
					  folder varchar(255),
					  status mediumint(9) NOT NULL,
					  UNIQUE KEY ID (ID)
						);";

  				 require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  				 dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_folder_visibility_status";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
			   $create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
					  ID mediumint(9) NOT NULL AUTO_INCREMENT,
					  folder_id mediumint(9) NOT NULL,
					  status varchar(255),
					  UNIQUE KEY ID (ID)
						);";

  				 require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  				 dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_deactvated_folders";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
			   $create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
					  ID mediumint(9) NOT NULL AUTO_INCREMENT,
					  folder_id mediumint(9) NOT NULL,
					  folder varchar(255),
					  UNIQUE KEY ID (ID)
						);";

  				 require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  				 dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_document_folders_meta";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
		 	$create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
		 	ID mediumint(9) NOT NULL AUTO_INCREMENT,
		 	folder_id mediumint(9) NOT NULL,
		 	meta_key varchar(255),
		 	meta_value longtext,
		 	UNIQUE KEY ID (ID)
		 	);";
		 
		 	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		 	dbDelta($create_dmt_user_cat_access_data);
		 }
		 $table_name = $wpdb->prefix . "dmt_group";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
		 	$create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
		 	ID int(10) NOT NULL AUTO_INCREMENT,
		 	group_name varchar(255), 
		 	UNIQUE KEY ID (ID)
		 	);";
		 
		 	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		 	dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_user_group";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
		 	$create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
		 	group_id int(10) ,
		 	user_id int(10) 
		 	);";
		 
		 	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		 	dbDelta($create_dmt_user_cat_access_data);
		 }
		 
		 $table_name = $wpdb->prefix . "dmt_group_folder";
		 if( $wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name )
		 {
		 	$create_dmt_user_cat_access_data = "CREATE TABLE $table_name (
		 	group_id int(10) ,
		 	folder_id int(10) 
		 	);";
		 
		 	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		 	dbDelta($create_dmt_user_cat_access_data);
		 }

	 }
	register_activation_hook( __FILE__, 'dmt_create_notifications_table' );
	
	function aj_in_login_dashboard_deactivate()
	{
		delete_option('aj_in_company_url');
		delete_option('aj_in_company_title');
		delete_option('aj_in_company_image_url');
		delete_option('aj_in_company_fb_like_page');
	
	}
	register_deactivation_hook( __FILE__, 'aj_in_login_dashboard_deactivate' );
	
function dmt_bind_upload_cb() {
		global $pagenow;
		if ( $pagenow != 'media-upload.php' )
			return;
			
		$post_id = $_REQUEST['post_id'];
		$ajax_url = plugins_url('/includes/ajax_file.php', __FILE__ );	
		//var_dump($_REQUEST['post_id']);
	?>
    <script type="text/javascript">jQuery(document).ready(function(){dmtBindPostDocumentUploadCB('<?php echo $post_id?>','<?php echo $ajax_url?>')});</script>
	<?php }
add_action( 'admin_print_footer_scripts','dmt_bind_upload_cb');	

//To solve the problem with the broken checklist

class Category_Checklist {

	function init() {
		add_filter( 'wp_terms_checklist_args', array( __CLASS__, 'checklist_args' ) );
	}

	function checklist_args( $args ) {
		add_action( 'admin_footer', array( __CLASS__, 'script' ) );

		$args['checked_ontop'] = false;

		return $args;
	}

	// Scrolls to first checked category
	function script() {
?>
<script type="text/javascript">
	jQuery(function(){
		jQuery('[id$="-all"] > ul.categorychecklist').each(function() {
			var $list = jQuery(this);
			var $firstChecked = $list.find(':checked').first();

			if ( !$firstChecked.length )
				return;

			var pos_first = $list.find(':checkbox').position().top;
			var pos_checked = $firstChecked.position().top;

			$list.closest('.tabs-panel').scrollTop(pos_checked - pos_first + 5);
		});
	});
</script>
<?php
	}
}
//Function to remove the dashboard and redirect if called.
function dmt_remove_menu_items() {
	global $submenu,$menu; 
 	unset($menu[2]);//Removes dashboard from menu items.
	if(preg_match('/\/wp-admin\/index.php/',$_SERVER['SCRIPT_NAME']))
	{
		wp_redirect(admin_url('edit-tags.php?taxonomy=document_folders&post_type=document_files'), 301 ); exit;
	}
}
add_action('admin_menu', 'dmt_remove_menu_items');

//Function to remove quick edit and formfield slug from document_folder backend
function dmt_hide_document_folder_slug_js() 
{    
    global $current_screen;

    if( 'edit-document_folders' != $current_screen->id )
        return;
    ?>
    <script type="text/javascript">         
        jQuery(document).ready( function() {
			
			//Remove slug from the single document_folder edit page
			jQuery('input#slug').parent().parent().remove();
			
			//Remove slug from add new document_folder view
			jQuery('input#tag-slug').parent().remove();
			
			//Remove slug from quick edit items.
            jQuery('div.row-actions').each(function (i) {
			 jQuery('span:contains("Slug")').each(function (i) {
                jQuery(this).parent().remove();
            	});
				//Remove view from row items
			   jQuery(this).find('span.view').remove();
			   
			   //Format Delete in row items.
			   var delete_html = jQuery(this).find('span.delete').html();
			   jQuery(this).find('span.delete').html(delete_html.replace(' | ',''));
            });
        });    
    </script>
    <?php
}
add_action( 'admin_head-edit-tags.php', 'dmt_hide_document_folder_slug_js' );
	

function dmt_hide_user_roles_for_add_user()
{
	if(preg_match('/\/wp-admin\/user-new.php/',$_SERVER['REQUEST_URI']) || preg_match('/\/wp-admin\/user-edit.php/',$_SERVER['REQUEST_URI']))	
	{
		if(current_user_can('manage_options') ||  current_user_can('administrate'))
			return;
		
		else
		{?>
     		<script type="text/javascript">         
        	jQuery(document).ready( function() {
				jQuery('select#role').parent().parent().before('<tr><th></th><td><input type="hidden" name="role" value="subscriber"/></td></tr>')
				jQuery('select#role').parent().parent().remove();
			});
			</script>
    <?php 
		}
	}
}
add_action( 'admin_head-user-new.php', 'dmt_hide_user_roles_for_add_user' );
add_action( 'admin_head-user-edit.php', 'dmt_hide_user_roles_for_add_user' );

function dmt_set_auth_cookie_duration($duration,$user_id,$remember)
{
	//The duration of the authentication cookie in seconds.
	return 1209600;
}
add_filter('auth_cookie_expiration', 'dmt_set_auth_cookie_duration',10,3);


/** Radio Button Walker */
class tcb_Walker_Category_Radiolist extends Walker {
  var $tree_type = 'category';
  var $db_fields = array( 'parent'=>'parent', 'id'=>'term_id' );

  function start_lvl( &$output, $depth, $args ){

    $indent  = str_repeat( "\t", $depth );
    $output .= "$indent<ul class='document-folder-children children'>\n";
  }

  function end_lvl( &$output, $depth, $args ){
    $indent  = str_repeat( "\t", $depth );
    $output .= "$indent</ul>\n";
  }
	function start_el( &$output, $category, $depth, $args, $id = 0 ) {

		extract($args);
		if ( empty($taxonomy) )
			$taxonomy = 'category';

		if ( $taxonomy == 'category' )
			$name = 'post_category';
		else
			$name = 'tax_input['.$taxonomy.']';

		$class = in_array( $category->term_id, $popular_cats ) ? ' class="popular-category"' : '';
		$output .= "\n<li id='{$taxonomy}-{$category->term_id}'$class>" . '<label class="selectit"><input value="' . $category->term_id . '" type="radio" name="parent" id="document-folder-parent-'.$category->term_id.'"' . checked( in_array( $category->term_id, $selected_cats ), true, false ) . disabled( empty( $args['disabled'] ), false, false ) . ' /> ' . esc_html( apply_filters('the_category', $category->name )) . '</label>';
	}


  function end_el( &$output, $category, $depth, $args ){
    $output .= "</li>\n";
  }
}


//code modified by surekha: fetches the array from get_all_user_folders() and displays it.If the array returned is empty,no folders are displayed//////
function wp_terms_checklist_return_html($post_id = 0, $args = array()) {

	$categories=array();
 	$defaults = array(
		'descendants_and_self' => 0,
		'selected_cats' => false,
		'popular_cats' => false,
		'walker' => null,
		'taxonomy' => 'category',
		'checked_ontop' => true 
	);
	$args = apply_filters( 'wp_terms_checklist_args', $args, $post_id );

	extract( wp_parse_args($args, $defaults), EXTR_SKIP );

	if ( empty($walker) || !is_a($walker, 'Walker') )
		$walker = new Walker_Category_Checklist;

	$descendants_and_self = (int) $descendants_and_self;

	$args = array('taxonomy' => $taxonomy);

	$tax = get_taxonomy($taxonomy);
	$args['disabled'] = !current_user_can($tax->cap->assign_terms);

	if ( is_array( $selected_cats ) )
		$args['selected_cats'] = $selected_cats;
	elseif ( $post_id )
		$args['selected_cats'] = wp_get_object_terms($post_id, $taxonomy, array_merge($args, array('fields' => 'ids')));
	else
		$args['selected_cats'] = array();

	if ( is_array( $popular_cats ) )
		$args['popular_cats'] = $popular_cats;
	else
		$args['popular_cats'] = get_terms( $taxonomy, array( 'fields' => 'ids', 'orderby' => 'count', 'order' => 'DESC', 'number' => 10, 'hierarchical' => false ) );

	if ( $descendants_and_self ) {
		$categories = (array) get_terms($taxonomy, array( 'child_of' => $descendants_and_self, 'hierarchical' => 0, 'hide_empty' => 0 ) );
		$self = get_term( $descendants_and_self, $taxonomy );
		array_unshift( $categories, $self );
	} else {
	
	if(!current_user_can('administrate'))
	{
		$push = get_all_user_folders();
		
		if(count($push)!=0)
		{
				
		$args1 = array(
		'hide_empty'    => false, 
		'include'       => $push
		); 
			$categories =  get_terms($taxonomy,  $args1);
		}
	
	}
	else
	{
		$args1 = array(
		'get'    => 'all', 
		); 
		$categories =  get_terms($taxonomy,  $args1);
	}
	

		
	}

	if ( $checked_ontop ) {
		// Post process $categories rather than adding an exclude to the get_terms() query to keep the query the same across all posts (for any query cache)
		$checked_categories = array();
		$keys = array_keys( $categories );

		foreach( $keys as $k ) {
			if ( in_array( $categories[$k]->term_id, $args['selected_cats'] ) ) {
				$checked_categories[] = $categories[$k];
				unset( $categories[$k] );
			}
		}

		// Put checked cats on top
		return call_user_func_array(array(&$walker, 'walk'), array($checked_categories, 0, $args));
	}
	// Then the rest of them
	return call_user_func_array(array(&$walker, 'walk'), array($categories, 0, $args));
}
//code modified by surekha: fetches the array from get_all_user_folders() and displays it.If the array returned is empty,no folders are displayed//////
function remove_dropdown_cats($output){

if($_REQUEST["taxonomy"]!="document_folders")
	return;

$output = "";
$output .= '<div >';
$output .= '<div class="ppFolderStructure-document-folder"> ';
$output .= '<div class="ppFolderStructureUl">';
$output .= '<div class="plupload_header">';
$output .= '<div class="plupload_header_content">';
$output .= '<div class="plupload_header_title">Select folders</div>';
$output .= '<div class="plupload_header_text">These are the folders to which the files will be added.</div>';
$output .= '</div>';
$output .= '</div>';
$output .= '<div class="ppFolderStructureUlwrapper-document-folder">';

$output .= '<ul class="folder-root"><li id="document_folders-"><label class="selectit"><input value="0" type="radio" name="parent" id="document-folder-parent-" checked="checked"> none</label></li>
		';
	  $walker = new tcb_Walker_Category_Radiolist;
		$nested_args= array(
			'descendants_and_self' => 0,
			'selected_cats' => false ,
			'popular_cats' => false,
			'walker' => $walker,
			'taxonomy' => 'document_folders',
			'checked_ontop' => false,
			'include_category' => array(),); 
			
$output .= wp_terms_checklist_return_html(0, $nested_args); 
$output .= '</ul>';
$output .= '</div>';
$output .= '<div class="plupload_filelist_footer">';
$output .= '<div class="plupload_file_name">'; 
$output .= '</div>';
$output .= '</div>';
$output .= '</div>';
$output .= '</div> ';
    
  
 
$output .= '</div>';
return $output;
}
 
 add_filter( 'wp_dropdown_cats', 'remove_dropdown_cats',1,10  );

Category_Checklist::init();
include dirname( __FILE__ ) . '/includes/admin_front_end.php';
include dirname( __FILE__ ) . '/includes/user_roles.php';
include dirname( __FILE__ ) . '/includes/user_settings_folders.php';	
include dirname( __FILE__ ) . '/includes/landing_page_and_login_redirect.php';
include dirname( __FILE__ ) . '/includes/add_to_notifications_table.php';
include dirname( __FILE__ ) . '/includes/add_messages.php';
include dirname( __FILE__ ) . '/includes/dmt_relative_time.php';
include dirname( __FILE__ ) . '/includes/dmt_quick_edit.php';
include dirname( __FILE__ ) . '/includes/recurrsive_folder_status_update.php';
include dirname( __FILE__ ) . '/includes/functions.php';