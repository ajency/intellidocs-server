<?php
/*
Plugin Name: Export To Excel
Plugin URI: http://www.wasptech.com
Description: Export category contents to excel format.
Version: 0.0.1
Author: Donal Moran
Author URI: http://www.wasptech.com
License: GPL3
*/
		
function aj_xl_get_folders($parent = 0)
{
	$taxonomies = apply_filters('xl_folder_taxonomies', array('document_folders'));
	$args		= array('orderby' => 'name', 'hide_empty' => false ,'parent' => $parent,'fields' => 'ids');
	
	$folder_ids = get_terms( $taxonomies, $args );
	
	return $folder_ids;
}

function aj_xl_get_files_in_folder($folder_id)
{
	$args = array(
			'numberposts'     => -1,
			'offset'          => 0,
			'orderby'         => 'post_date',
			'order'           => 'DESC',
			'post_type'       => apply_filters('xl_file_post_type','document_files'),
			'post_status'     => 'publish',
			'tax_query'		  => array(
	
					array(
							'taxonomy' => apply_filters('xl_file_folder_taxonomy','document_folders'),
							'field' => 'id',
							'terms' => $folder_id,
							'include_children' => true,
					)
	
			),
	);
	
	$files = get_posts($args);
	return $files;
}

function aj_xl_get_file_folders($file_id,$taxonomy)
{
	$folder_ids = wp_get_post_terms($file_id, $taxonomy, array("fields" => "ids"));
	
	$file_folders = array();
	
	if($folder_ids)
	{
		foreach($folder_ids as $id)
		{
			$temp = aj_xl_recurse_find_parent($id);
			$path = aj_xl_folder_structure($temp);
			$file_folders[] = $path;
		}
	}
	
	return $file_folders;
}


function aj_xl_recurse_find_parent($folder_id,$folder_path = '')
{
	$term = get_term_by( 'id', $folder_id , 'document_folders');
	$folder_path .= '/'.$term->name;

	if($term->parent != 0)
		return aj_xl_recurse_find_parent($term->parent,$folder_path);
	else
		return array($folder_id,$folder_path);
}


function aj_xl_folder_structure($folder_details)
{
	$folders	 = $folder_details[1];
	$folder ='';
	$folders = explode('/',$folder_details[1]);
	for($i = count($folders); $i > 0 ; $i--)
	{
	$folder .= $folders[$i].'/';
	}
	$folder = ltrim($folder,'/');
			$folder = rtrim($folder,'/');
			return $folder;
}


function aj_xl_save_to_file_system($folder_id,$taxonomy,$filename)
{

	$upload_dir = wp_upload_dir();
	
	$upload_dir	= $upload_dir['basedir'].'/logs';
	
	if(!is_dir($upload_dir))
		mkdir($upload_dir);

	$my_excel_content = file_get_contents_curl(plugins_url('/aj_export_to_excel/xl_save.php/?ID='.$folder_id.'&taxonomy='.$taxonomy));
	
	$filename = trailingslashit($upload_dir).$filename;

	if(file_exists($filename))
		unlink($filename);
	
	if ( ! file_put_contents( $filename, $my_excel_content) ) {
		echo 'error saving file on the server.!';
	}
}


function file_get_contents_curl($url) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
	curl_setopt($ch, CURLOPT_URL, $url);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}


//////////////////////////////////RENDER DISPLAY TABLE///////////////////////////////

function aj_xl_display_table_head($folder_id)
{
	$folder = get_term( $folder_id, 'document_folders');
	
	$table_head  = '<table border="5" bordercolor="#0066FF">';
  	$table_head .= '<tr><th height="40" bgcolor="#0066FF" style="color:#FFF;font-family:arial;">'.$folder->name.'</th></tr>';
  	$table_head .= '<tr><td><table width="100%" border="1" cellpadding="1" cellspacing="1" bordercolor="#666666">';
    $table_head .= '<tr><th width="400" bgcolor="#89B3FE" style="color:#FFF; font-family:arial; font-size:14px">File Name</th>';
   	$table_head .= '<th width="400" height="30" bgcolor="#89B3FE" style="color:#FFF; font-family:arial; font-size:14px">Publish Date</th>';
    $table_head .= '<th width="400" bgcolor="#89B3FE" style="color:#FFF; font-family:arial; font-size:14px;">Folder</th></tr>';
    
    return $table_head;
}


function aj_xl_display_table_content($folder_id)
{
	$files = aj_xl_get_files_in_folder($folder_id);
	
	if($files)
	{
		foreach ($files as $file)
		{
			$table_content .= '<tr>';
			$table_content .= '<td>'.$file->post_title.'</td>';
			$table_content .= '<td align="center">'.$file->post_date.'</td>';
			
			$folders = aj_xl_get_file_folders($file->ID,'document_folders');
			if($folders)
			{
				foreach ($folders as $folder)
				{
					$table_content .= '<td align="center">'.$folder.'</td>';
				}
			}
			$table_content .= '</tr>';
		}
	}
    $table_content .= '</table></td></tr></table>';
    
    return $table_content;
}


function aj_xl_file_download_action($folder_id)
{
	echo '| <span class="dmtFolderMeta"><a href="'.plugins_url('/aj_export_to_excel/xl_export.php/?ID='.$folder_id.'&taxonomy=document_folders').'" class="download">Download</a></span>';
}
add_action('dmtFolderMetaActions','aj_xl_file_download_action');


////////////////////////////////////ADMIN INCLUDES//////////////////////////////////////
require_once ('inc/admin.php');
require_once ('inc/array_pagination.php');