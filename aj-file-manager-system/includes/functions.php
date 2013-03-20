<?
 
 
 function file_download_option($actions, $post)
 {
 	
 	 if ($post->post_type =="document_files"){ 
	 $upload_dir = wp_upload_dir();  
 
		//$actions['download'] =  '<a href="'.admin_url('admin.php').'?page=download-file&filename='.$post->post_title.'">Download</a>';
		//$actions['download'] = '<a href="'.get_bloginfo('url').'/wp-content/uploads/'.$post->post_title.'">Download</a>';
 	
		return $actions;
	}
 	//post_type=document_files
 }
 
 //add_filter('post_row_actions','file_download_option',10,2);
 function do_download()
{
	if(isset($_REQUEST["filename"]) && isset($_REQUEST["page"]) && isset($_REQUEST["folder"]))
	{
		if (dmt_check_users_folders($_REQUEST["folder"])|| current_user_can( 'manage_options' ))
			{
				if($_REQUEST["page"]=="download-file")
				{	
					$file_id=$_REQUEST["filename"];
					$attachment_args = array(
					 'post_type' => 'attachment',
					 'numberposts' => -1,
					 'post_status' => null,
					 'post_parent' => $file_id,
					 );
					 $attachments = get_posts($attachment_args);
					 $filename = basename ( get_attached_file( $attachments[0]->ID ) ); 
					// $filenamepath= wp_get_attachment_url($attachments[0]->ID);
					 $upload_dir = wp_upload_dir(); 
					//$id = get_post_thumbnail_id($filename);
					 $filenamepath=  $upload_dir['basedir']."/".$filename;
					
					
					header("Content-Type: application/octet-stream");
					header("Content-Disposition: attachment; filename=".get_the_title($file_id));
					$str = readfile($filenamepath);
					 
					exit();
				}
			}
			else
			{
				wp_redirect(home_url().'/wp-admin/admin.php?page=intellidocs-document-files');
				exit(0);
			}
	} 
		
}
 add_action('init','do_download');
 
 
  
add_filter('wp_get_attachment_url', 'honor_ssl_for_attachments');
function honor_ssl_for_attachments($url) {
 $http = site_url(FALSE, 'http');
 $https = site_url(FALSE, 'https');
 return ( $_SERVER['HTTPS'] == 'on' ) ? str_replace($http, $https, $url) : $url;
}
//functions to load file list for subscribers
function dmt_manage_document() {
	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	require_once('subscribers_file_list.php');

}

function dmt_list_document_folder() {
	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	require_once('document_folder.php');

}


 function dmt_get_current_user_role()
{
	global $user_ID;

	$user = new WP_User( $user_ID );

	$role= "";
	if ( !empty( $user->roles ) && is_array( $user->roles ) ) {
		foreach ( $user->roles as $role ){
			return $role;
		}
			
	}

}
 function dmt_get_current_user_folders()
{
	global $user_ID,$wpdb;
	
	$user_access_table = $wpdb->prefix . "dmt_user_cat_access_data";
	$user_group = $wpdb->prefix . "dmt_user_group";
	$group_folder = $wpdb->prefix . "dmt_group_folder";
	
	$access_folders = $wpdb->get_results( "
										SELECT category_id
										FROM $user_access_table
										WHERE user_id = $user_ID
										UNION
										SELECT folder_id
										FROM $user_group,$group_folder 
										WHERE $user_group.group_id = $group_folder.group_id and user_id  = $user_ID
										");	
	$user_accessfolders = array();
	foreach ($access_folders as $access_folderval)
	{
		if(dmt_check_folder_status_is_published($access_folderval->category_id))
		{
			$user_accessfolders[] =intval($access_folderval->category_id);
		}
	} 
	 
	return $user_accessfolders;

}
function dmt_recurse_find_parent_folder_ids($cat_id,$folder_ids = '')
	{ 
		$term = get_term_by( 'id', $cat_id , 'document_folders');
		$folder_ids .= ','.$term->parent;
		
		if($term->parent != 0)
		{
			return dmt_recurse_find_parent_folder_ids($term->parent,$folder_ids);
		}
		else
		{
			$folder_ids =  explode(",",$folder_ids) ; 
			$folder_ids = array_map(create_function('$value', 'return (int)$value;'),$folder_ids);
			return ($folder_ids);
		}
	}
	
function dmt_check_users_folders($folder_id)
{
	$accessfolders = dmt_recurse_find_parent_folder_ids($folder_id,$folder_id);
				 
	$accesscategory = dmt_get_current_user_folders();
	 
	foreach ($accesscategory as $accesscategoryval)
	{ 
		if(in_array($accesscategoryval,$accessfolders))
		{
			return true;
		}
	}
	

}

function dmt_change_password_page()
{

	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	include_once 'change-password.php';
}
function dmt_menu_page_subscriber() { 
	
	if (dmt_get_current_user_role()=="subscriber"){
		$imgpath = str_replace('/includes/img/','/img/',plugins_url( '/img/menu-icon.png', __FILE__ ));
		//add_menu_page('Manage Documents', 'Manage Documents', 'read', 'manage-document', 'dmt_manage_document',  $imgpath, 7);
		//add_submenu_page('manage-document', 'Document Folders', 'Document Folders', 'read', 'list-document-folder', 'dmt_list_document_folder' ); 
	//	add_menu_page('Document Folders', 'Document Folders', 'read', 'list-document-folder', 'dmt_list_document_folder',  $imgpath, 7);
		//add_submenu_page('dmt_manage_document', 'Manage Documents', 'Manage Documents', 'read', 'manage-document', 'dmt_manage_document' );
		add_menu_page('Change Password', 'Change Password', 'read', 'change-password', 'dmt_change_password_page', '', 8);
	
		global $menu;
		$restricted = array(__('Profile'),__('Add'));
		end ($menu);
		while (prev($menu)){
			$value = explode(' ',$menu[key($menu)][0]); 
			if(in_array($value[0] != NULL?$value[0]:"" , $restricted)){unset($menu[key($menu)]);}
			}
	}
}
 add_action('admin_menu', 'dmt_menu_page_subscriber',11); 
 
 
 function dmt_login_redirect_subscriber ($redirect_to, $request, $user) {
	 if (isset($user->roles))
	{
		if(in_array('subscriber',$user->roles))
		{
			return 'wp-admin/admin.php?page=intellidocs-document-files';
		}
	}
	
	return $redirect_to;
  
 } 
 
 add_filter('login_redirect', 'dmt_login_redirect_subscriber',10,3);
 
 /**
 * Add a menu page to backend
 */
 
 
 function dmt_show_menu_page_add_group()
{
	$user_role = dmt_get_current_user_role();
	if (  ($user_role  != "dmt_site_admin" && $user_role  !="administrator"))  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	include_once 'manage-groups.php';
}

function dmt_add_manage_group_page()
{    
	$user_role = dmt_get_current_user_role();
	if ($user_role  == "dmt_site_admin" || $user_role  =="administrator")
	{
		add_submenu_page('edit.php?post_type=document_files', 'Manage Groups', 'Manage Groups', 'edit_posts', 'manage-groups', 'dmt_show_menu_page_add_group' );  
	}
	
}
add_action( 'admin_menu', 'dmt_add_manage_group_page' );

//Group Manage functions

 

 
function get_group_select_box($group_id=0)
{
	global $wpdb;
	
	 
	$groupdata = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}dmt_group ORDER BY group_name ", ARRAY_A);
	
	$str  = '';
	
	$str .= '<option value="">Select Group</option>';
	foreach($groupdata as $groupdatavalues) { 
		$checked = "";
		if($group_id==$groupdatavalues['ID'])
		{
			$checked = "checked";
		}
		$str .= '<option value="'.$groupdatavalues['ID'].'" '.$checked.'>'.$groupdatavalues['group_name'].'</option>';
			}
			 
	$str .= '';
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }
}


add_action('wp_ajax_get_group_select_box','get_group_select_box');
function get_available_users()
{
	global $wpdb;
	$group_id = isset($_REQUEST['group_id']) ? intval($_REQUEST['group_id']) : 0;
	$str ="";
	if ($group_id !=0)
	{
		$selected_users = array();
		$result_users =$wpdb->get_results("SELECT user_id FROM {$wpdb->prefix}dmt_user_group where group_id = $group_id ", ARRAY_A);
		foreach ($result_users as $result_usersval) 
		{
			$selected_users[] = intval($result_usersval["user_id"]);  
		}
		$userdata = $wpdb->get_results("SELECT id,display_name FROM {$wpdb->prefix}users   ORDER BY display_name ", ARRAY_A);
		$str  = '<table cellpadding="5" cellspacing="20">'; 
		$c=1;
		foreach($userdata as $userdatavalues) {
			if($c==1)
			{
				$str .= '<tr>';
			}
			if($selected_users):  
					  $checked = (in_array($userdatavalues['id'],$selected_users))?'checked="checked"':'';  
				endif; 
			$str .= '<td><input type="checkbox"  name="available_user" id="available_user" class="available_user" value="'.$userdatavalues['id'].'" '.$checked.'> '.$userdatavalues['display_name'].'</td>';
			$c++;
			if($c==5)
			{
				$c = 1;
				$str .= '</tr>';
			}
		}
		$str .= '</table>';
	}
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }
}



add_action('wp_ajax_get_available_users','get_available_users');

 

function add_groups()
{ 
	$group_name = $_POST['group_name']; 
	 
	global $wpdb;
	$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group (group_name)values ('".$group_name."')");	
	 
	echo "<p>Group Added Successfully</p>"; 

	die();	
}
add_action('wp_ajax_add_groups','add_groups'); 

function update_group_name()
{ 
	$group_name = $_POST['group_name']; 
	$group_id = $_POST['group_id']; 
	 
	global $wpdb;
	$result = $wpdb->get_results("update   {$wpdb->prefix}dmt_group set group_name = '".$group_name."' where id = $group_id");	
	 
	echo "<p>Group Name Updated Successfully</p>"; 

	die();	
}
add_action('wp_ajax_update_group_name','update_group_name'); 

function get_all_folders()
{ 

	global $wpdb;
	$str="";
	$group_id = $_POST['group_id']; 
	 
	 $parent_args = array(
 	'type'                     => 'post',
	'child_of'                 => 0,
	'parent'                   => 0,
	'orderby'                  => 'name',
	'order'                    => 'ASC',
	'hide_empty'               => 0,
	'hierarchical'             => 0,
	'taxonomy'                 => 'document_folders',
	'pad_counts'               => false
 	);
	
	$categories = get_categories( $parent_args );
	$selected_folderss = "";
	//$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group (group_name)values ('".$group_name."')");	
	$selected_folders = array();
	$result_folders =$wpdb->get_results("SELECT folder_id FROM {$wpdb->prefix}dmt_group_folder where group_id = $group_id ", ARRAY_A);
	foreach ($result_folders as $result_foldersval) 
	{
		$selected_folders[] = intval($result_foldersval["folder_id"]);  
	}
	$str .='<ul class="dmtDocumentFolderStructure">';
	 foreach($categories as $category): 
				if($selected_folders):  
					  $checked = (in_array($category->cat_ID,$selected_folders))?'checked="checked"':'';  
				endif; 
				$str .='<li>';
				$str .='<label class="selectit">';
				$str .='<input value="'.$category->cat_ID.'" type="checkbox" name="folder_list" id="folder_list"  class="folder_list" '.$checked.'/> '.$category->cat_name;
				$str .='</label>';
				$str .='</li>';
	  endforeach ;
	$str .='</ul>'; 
	 
	echo $str; 

	die();	
}
add_action('wp_ajax_get_all_folders','get_all_folders'); 



function add_folders_to_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$folder_ids = $_POST['folder_ids'];
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group_folder where group_id = ".$group_id);	
	if($folder_ids)
	{
		foreach($folder_ids as $folder_id)
		{
			$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group_folder (group_id,folder_id)values (".$group_id.",".$folder_id.")");	
		 }
	}
	echo "<p>Group Folders Updated Successfully</p>"; 

	die();	
}
add_action('wp_ajax_add_folders_to_group','add_folders_to_group'); 


function add_users_to_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$user_ids = $_POST['user_ids'];
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_user_group where group_id = ".$group_id);	
	if($user_ids)
	{
		foreach($user_ids as $user_id)
		{
			$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_user_group (group_id,user_id)values (".$group_id.",".$user_id.")");	
		 }
	}
	echo "<p>Group Users Updated Successfully</p>"; 

	die();	
}
function get_group_actions($group_id)
{ 

	global $wpdb;
	 
	 
	echo '<input id="delete-group-button" group-id="'.$group_id.'" type="button" value="x" class="button"><input id="delete-group-button" group-id="'.$group_id.'" type="button" value="x" class="button">'; 

	die();	
}
add_action('wp_ajax_add_users_to_group','add_users_to_group'); 

function delete_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group where id = ".$group_id);	
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_user_group where group_id = ".$group_id);	
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group_folder where group_id = ".$group_id);	
	 
	echo "<p>Group Deleted Successfully</p>"; 

	die();	
}
add_action('wp_ajax_delete_group','delete_group'); 

function dmt_change_password_dashboard()
{ 

	global $wpdb,$user_ID;
	
	$user_pass1 = $_POST['user_pass1']; 
	
	wp_set_password( $user_pass1, $user_ID );
	 
	echo "<p>Your Password Has Been Reset Successfully. Please Wait While You Are Being Redirected To The Login Page.</p>"; 

	die();	
}
add_action('wp_ajax_dmt_change_password','dmt_change_password_dashboard'); 

 