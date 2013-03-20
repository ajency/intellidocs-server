<?php
/**
 * Function to add capability for users to view only specific folders
 */
add_action( 'show_user_profile', 'dmt_extend_profile_fields' );
add_action( 'edit_user_profile', 'dmt_extend_profile_fields' );

function dmt_extend_profile_fields( $user ) { 
	
 $selected_folders = get_user_meta($user->ID, 'dmt_folder_access');
 $nested_args= array(
			'descendants_and_self' => 0,
			'selected_cats' => $selected_folders[0]['document_folders'],
			'popular_cats' => false,
			'walker' => null,
			'taxonomy' => 'document_folders',
			'checked_ontop' => false,
	); 
 
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
?>
<?php 
/**
 * Show this function in between
 * <ul class="dmtDocumentFolderStructure"></ul>
 * if nested folder structure is needed
 */
//wp_terms_checklist(0, $nested_args); ?>
<?php $categories = get_categories( $parent_args ); ?>
	<h3>Folder Visibility</h3>
	
	<table class="form-table">

	<tr>
		<th><label for="tax_input[document_folders]">Folders</label></th>

		<td>
			<div class="dmtDocumentFolderStructureWrapper">
			<ul class="dmtDocumentFolderStructure">
	<?php foreach($categories as $category):?>
				<?php if($selected_folders[0]['document_folders']): ?>
					<?php $checked = (in_array($category->cat_ID,$selected_folders[0]['document_folders']))?'checked="checked"':''; ?>
				<?php endif;?>
				<li id="document_folders-<?php echo $category->cat_ID;?>">
					<label class="selectit">
						<input value="<?php echo $category->cat_ID;?>" type="checkbox" name="tax_input[document_folders][]" id="in-document_folders-<?php echo $category->cat_ID;?>" <?php echo $checked; ?> /> <?php echo $category->cat_name;?>
					</label>
				</li>
	<?php endforeach;?>
			</ul>
			</div>
			<span class="description">Set the folders the current user has access to.</span>
		</td>
	</tr>

</table>
<?php }

/**
 * Function to save the changes for the folders visible to the current user
 */
 
add_action( 'personal_options_update', 'dmt_extend_profile_fields_save' );
add_action( 'edit_user_profile_update', 'dmt_extend_profile_fields_save' );

function dmt_extend_profile_fields_save($user_id) {

	if ( !current_user_can( 'edit_user') )
		return false;
	
	update_usermeta( $user_id, 'dmt_folder_access', $_POST['tax_input'] );
	
	global $wpdb;
	$table_name = $wpdb->prefix . "dmt_user_cat_access_data";
	
	$wpdb->query( $wpdb->prepare( 
						"
							DELETE FROM $table_name
						 	WHERE user_id = %d
						",
							$user_id
						)
				);
	$categories = $_POST['tax_input']['document_folders'];
	foreach($categories as $category)
	{
		 $wpdb->insert( $table_name, array( 'user_id' => $user_id, 'category_id' => $category ) );
	}
}


		        