<?php
/*
Template Name: DMT Ajax Page Template
*/
?>
<?php 
if(isset($_POST['user_name']))
{
	$test = new DMT_FolderStructure('samplepage');
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
		$user_id = $test->get_cat_hierchy_n_files(0,0,$args);
		echo json_encode($user_id);
}
?>
