<?php
header('Content-Type: application/json');

$path = $_SERVER['DOCUMENT_ROOT'];
$mypath = '/intellidocs';
$path = $path.$mypath;
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

ob_start();
//var_dump($_REQUEST);
$h = ob_get_clean();

add_filter('wp_mail_content_type',create_function('', 'return "text/html";'));
//wp_mail('suraj@ajency.in','Var',$h);

class DMT_FolderStructure
{
	public $user_id;
		
	public function __construct($user_name)
	{
		$user = new WP_User($user_name);
		$this->user_id = $user->ID;		
	}
	
	public function get_the_user($user_id = '')
	{
		if($user_id == '')
		{
			$user_id = $this->user_id;
		}
		
		$user = new WP_User($user_id);
		
		if ( !empty( $user->roles ) && is_array( $user->roles ) ) {
			foreach ( $user->roles as $role )
				if($role == 'dmt_site_admin')
				return true;
		}
		
		return false;
	}

	public function get_cat_hierchy_n_files($child_of,$parent,$args,$folder){
		

		$args = array_merge($args,array('parent'=> $parent,'child_of' => $child_of));
		
		$cats  = get_categories($args);

		$ret = array();
		
		$files_array = array();
		
		$returned_files = $this->get_files_in_category($parent);
			
			if(sizeof($returned_files)>0)
			{
				foreach($returned_files as $returned_file)
				{
					$files_array[] = $returned_file;
				}
			}
			
		foreach($cats as $cat)
		{
			$id = $cat->cat_ID;
			
			$temp_folder_structure 	= $this->dmt_recurse_find_parent($id);
			$folder 				= $this->dmt_get_folder_structure_files($temp_folder_structure);
			
			if(dmt_check_folder_status_is_published($id))
			{	
				if(!empty($id))
				{
					$folder_parent_id = get_term_by( 'id', $id , 'document_folders');
					$files_array[] = array( 
							'f_id'				=>	$id,
							'fld_item_id'		=> 	dmt_get_document_folder_meta($id,'document_folders_item_id'),
							'f_name'			=>	$cat->name,
							'f_type'			=> 	'folder',
							'f_ext' 			=> 	'folder',
							'f_attachment'		=> 	'',
							'f_modified' 		=> 	'-', 
							'f_folder'	 		=> 	$folder ,
							'f_parent'	 		=> 	$folder_parent_id ,
							'f_description' 	=> 	$cat->description,
							'f_file_count'  	=> 	count($this->get_files_in_category($id)),
							'f_sub_fld_count'	=>  $this->get_sub_folder_count($id,'document_folders'),
							'items'				=> 	$this->get_cat_hierchy_n_files($child_of,$cat->cat_ID,$args,$folder),
					   );
				}		  
			}
		}
		return $files_array;

	}
	public function get_sub_folder_count($cat_id,$taxonomy)
	{
		$sub_folders = get_terms( 'document_folders', array('child_of' => 0 ,'hide_empty' => false,'parent' => $cat_id) );
		return count($sub_folders);
	}
	public function get_folders_containing_file($file_id,$taxonomy)
	{
		$folders 			= wp_get_post_terms($file_id, $taxonomy);
		$file_folders_paths = array();
		if($folders)
		{
			foreach ($folders as $folder)
			{
				$temp_folder_structure 	= $this->dmt_recurse_find_parent($folder->term_id);
				$folder_path 			= $this->dmt_get_folder_structure_files($temp_folder_structure);
				$file_folders_paths[] 	= $folder_path;
			}
		}
		return $file_folders_paths;
	}
	public function get_files_in_category($cat_id)
	{
		$files_in_folder = array();
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
								'terms' => $cat_id,
								'include_children' => false,
								)
						
						),	
				);

		$files = get_posts($files_args);;
		
		foreach($files as $file)
		{
			$attachment_args = array(
					'post_type' => 'attachment',
					'numberposts' => -1,
					'post_status' => null,
					'post_parent' => $file->ID,
			);
			
			$temp_folder_structure = $this->dmt_recurse_find_parent($cat_id);
			$folder = $this->dmt_get_folder_structure_files($temp_folder_structure);
			
			$attachments = get_posts($attachment_args);
			
			$file_attchment =  wp_get_attachment_url($attachments[0]->ID);
			$file_parent_id = wp_get_post_terms($file->ID, 'document_folders'  );
			$files_in_folder[]= array(
					'f_id' 				=> $file->ID, 
					'f_name'			=> $file->post_title,
					'f_type'			=> 'file',
					'f_ext' 			=> ($this->get_file_extention($file_attchment))? $this->get_file_extention($file_attchment):'no-file',
					'f_attachment' 		=> ($file_attchment)?$file_attchment:'no-file',
					'f_modified'		=> $file->post_date,
					'f_folder'			=> $folder,
					'f_parent'			=> $file_parent_id,
					'f_description' 	=> $file->post_excerpt,
					'f_solicitor'		=> get_post_meta($file->ID,'dmt_file_solicitor',true),
					'f_item_id'			=> get_post_meta($file->ID,'dmt_file_item_number',true),
					'f_folders'			=> $this->get_folders_containing_file($file->ID,'document_folders'),
					'items'				=> array(),
					'leaf'				=> true,
					);
			}
			return $files_in_folder;	
	}
	
	public function get_file_extention($file_attchment){
		
			$extension = '.' . pathinfo( $file_attchment, PATHINFO_EXTENSION );
		
			if ( $extension == '.' )
				return '';
		
			return  $extension;
		
	}
	public function dmt_recurse_find_parent($cat_id,$folder_path = '')
	{
		$term = get_term_by( 'id', $cat_id , 'document_folders');
		$folder_path .= '/'.$term->name;
		
		if($term->parent != 0)
			return dmt_recurse_find_parent($term->parent,$folder_path);
		else
			return array($cat_id,$folder_path);
	}
	public function dmt_get_folder_structure_files($cat_details)
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
}
$args = array(
					'type'                     => 'post',
					'child_of'				   => 0,
					'parent'                   => 0,	
					'orderby'                  => 'name',
					'order'                    => 'ASC',
					'hide_empty'               => 0,
					'hierarchical'             => 1,
					'taxonomy'                 => 'document_folders',
					'pad_counts'               => true ,);
					
$new_object = new DMT_FolderStructure($_REQUEST['user_name']);
$callback = $_REQUEST['callback'];

global $wpdb;
$user_access_table = $wpdb->prefix . "dmt_user_cat_access_data";
$user_group = $wpdb->prefix . "dmt_user_group";
$group_folder = $wpdb->prefix . "dmt_group_folder";
$userid = $new_object->user_id;
/*$access_cats = $wpdb->get_results( 
								"
								SELECT category_id
								FROM $user_access_table
								WHERE user_id = $userid
								"
								);	*/
$access_cats = $wpdb->get_results( 
								"
								SELECT category_id
								FROM $user_access_table
								WHERE user_id = $userid 
								UNION 
								SELECT folder_id as category_id 
								FROM $user_group,$group_folder  
								WHERE $user_group.group_id = $group_folder.group_id and user_id  = $userid 
								");				
$files_folders = array();   			
foreach($access_cats as $access_cat)
{
	$folder_details = get_term_by( 'id', $access_cat->category_id , 'document_folders');
	
	$temp_folder_structure = $new_object->dmt_recurse_find_parent($access_cat->category_id);
	$folder = $new_object->dmt_get_folder_structure_files($temp_folder_structure);
			
	if(dmt_check_folder_status_is_published($access_cat->category_id))
	{
		if(!empty($folder_details->term_id))
			
			$folder_parent_id = get_term_by( 'id', $folder_details->term_id , 'document_folders');
			$files_folders[] = array(
							'f_id'				=> $folder_details->term_id,
							'fld_item_id'		=> dmt_get_document_folder_meta($folder_details->term_id,'document_folders_item_id'),
							'f_name'			=> $folder_details->name,
							'f_type'			=> 'folder',
							'f_ext' 			=> 'folder',
							'f_attachment'		=> '',
							'f_modified' 		=> '-', 
							'f_folder'	 		=> $folder,
							'f_parent'			=> $folder_parent_id,
							'f_description' 	=> $folder_details->description,
							'f_file_count'  	=> count($new_object->get_files_in_category($folder_details->term_id)), 
							'f_sub_fld_count'	=>  $new_object->get_sub_folder_count($folder_details->term_id,'document_folders'),
							'items' 			=> 	$new_object->get_cat_hierchy_n_files(0,$access_cat->category_id,$args,'')
							);
	}						
}
//echo $callback.'('.json_encode(array('items' => $new_object->get_cat_hierchy_n_files(0,0,$args,''))).')';
if(is_user_logged_in())
	echo $callback.'('.json_encode(array('items' => $files_folders,'session' => true)).')';
else
{
	echo $callback.'('.json_encode(array('items' => $files_folders,'session' => false)).')';
}
