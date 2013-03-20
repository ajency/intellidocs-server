<?php
function dmt_wp_update_sub_folders($taxonomy,$parent,$child_of,$status)
{
	$args = array('hide_empty' => 0,'get' => 'ids', 'orderby' => 'id','parent' => $parent,'child_of' => $child_of);
	$sub_folders = get_terms($taxonomy,$args);
	if($sub_folders)
	{
		foreach ($sub_folders as $sub_folder)
		{
			dmt_wp_update_sub_folder_status($sub_folder->term_id,$status);
			dmt_wp_update_sub_folders($taxonomy,$sub_folder->term_id,$child_of,$status);
		}
	}
}

function dmt_wp_update_sub_folder_status($folder_id,$status)
{
	global $wpdb;
	
	$folder_status_table = $wpdb->prefix . "dmt_folder_visibility_status";
	$folders_deactivated_table  = $wpdb->prefix . "dmt_deactvated_folders";
	
	$folder_status = $wpdb->get_var($wpdb->prepare("SELECT `status` FROM $folder_status_table WHERE `folder_id` = %d",$folder_id));
	
	if(!$folder_status)
		$rows_affected = $wpdb->insert($folder_status_table,array('folder_id' => $folder_id,'status' => $status));
	else
		$rows_affected = $wpdb->update($folder_status_table,array( 'status' => $status),array( 'folder_id' => $folder_id ));
	
	if($rows_affected && $status == 'published')
		$wpdb->query($wpdb->prepare("DELETE FROM $folders_deactivated_table WHERE `folder_id` = %d", $folder_id));
}