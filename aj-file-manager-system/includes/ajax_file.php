<?php 


$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';


class DMT_FetchFile
{
	protected $attachment_ID;
	protected $attachment_name;
	
	public function __construct($post_id)
	{
	$attachment_args = array(
					'post_type' => 'attachment',
					'numberposts' => -1,
					'post_status' => null,
					'post_parent' => $post_id,
			);
	$attachments = get_posts($attachment_args);
	$this->attachment_ID = $attachments[0]->ID;
	$this->attachment_name = $attachments[0]->post_title;
	}
	public function dmt_get_latest_file_attachment()
	{
		
		$file_attchment = get_attached_file($this->attachment_ID);
		$file_array = array(
						'file_id'			=> $this->attachment_ID,
						'file_name'			=> $this->attachment_name,
						'file_type'			=> $this->dmt_get_file_extention($this->attachment_ID),
							);
		return json_encode($file_array);							
	}
	public function dmt_delete_file_attachment($attachment_id,$post_id)
	{
		
		$success_fail = wp_delete_attachment( $attachment_id,true );
		$post_deleted = wp_delete_post( $post_id, true ); 
		if($success_fail)
		return json_encode(array('deleted' => 1));
	}	
	public 	function dmt_get_file_extention($attachment_id){
		
			$file = get_attached_file( $attachment_id);
			$extension = '.' . pathinfo( $file, PATHINFO_EXTENSION );
		
			//don't return a . extension
			if ( $extension == '.' )
				return '';
		
			return  $extension;
		
	}
}
if(isset($_REQUEST['dmt_latest_file'])){
	$attachment = new DMT_FetchFile($_REQUEST['dmt_latest_file']);
	
echo $attachment->dmt_get_latest_file_attachment();
}

if(isset($_REQUEST['dmt_delete_file'])){
	$attachment = new DMT_FetchFile($_REQUEST['dmt_file_post_id']);
	
echo $attachment->dmt_delete_file_attachment($_REQUEST['dmt_delete_file'],$_REQUEST['dmt_file_post_id']);
}
?>