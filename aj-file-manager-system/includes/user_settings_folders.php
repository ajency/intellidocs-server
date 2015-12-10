<?php
/**
 * Function to add capability for users to view only specific folders
 */
add_action( 'show_user_profile', 'dmt_extend_profile_fields' );
add_action( 'edit_user_profile', 'dmt_extend_profile_fields' );

function dmt_extend_profile_fields( $user ) {

	if(get_current_user_id()==$user->ID)
	{
	return false;
	}

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


	if(!current_user_can('administrate'))
	{
		$push = get_all_user_folders($show = false);

		if(count($push)!=0)
		{

		$args1 = array(
		'hide_empty'    => false,
		'include'       => $push
		);
			$categories =  get_terms('document_folders',  $args1);
		}

	}
	else
	{
		$args1 = array(
		'orderby'    => 'name',
		'hide_empty' => 0,
		'parent' =>0,
		'hierarchical'  => true
		);
		$categories =  get_terms('document_folders',  $args1);
	}




//Get existing folders for the user
	global $wpdb;
	$userid  = $user->ID;
	$user_access_table 	= $wpdb->prefix . "dmt_user_cat_access_data";
	$user_group 		= $wpdb->prefix . "dmt_user_group";
	$group_folder 		= $wpdb->prefix . "dmt_group_folder";

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

	$cats = array();
	foreach($access_cats as $access_cat)
	{
		$cats[] = get_term_by( 'id', $access_cat->category_id , 'document_folders');

	}
	$cats = intellidocs_sort_folders($cats);

	$user_folders = array();
	foreach($cats as $cat){
	$user_folders[] = $cat->term_id;
	}




?>
<?php
/**
 * Show this function in between
 * <ul class="dmtDocumentFolderStructure"></ul>
 * if nested folder structure is needed
 */
//wp_terms_checklist(0, $nested_args); ?>
<?php //$categories = get_categories( $parent_args ); ?>
	<h3>Folder Visibility</h3>

	<table class="form-table">

	<tr>
		<th><label for="tax_input[document_folders]">Folders</label></th>

		<td>
			<div class="dmtDocumentFolderStructureWrapper">
			<ul class="dmtDocumentFolderStructure">
	<?php
if(!is_null($categories)){
	 foreach($categories as $category):?>
				<?php if($selected_folders[0]['document_folders']): ?>
					<?php
					 //$checked = (in_array($category->term_id,$selected_folders[0]['document_folders']))?'checked="checked"':'';
					 //Check against existing folder list.
					 $checked = (in_array($category->term_id,$user_folders))?'checked="checked"':'';
				 ?>
				<?php endif;?>
				<li id="document_folders-<?php echo $category->term_id;?>">
					<label class="selectit">
						<input value="<?php echo $category->term_id;?>" type="checkbox" name="tax_input[document_folders][]" id="in-document_folders-<?php echo $category->term_id;?>" <?php echo $checked; ?> /> <?php echo $category->name;?>
					</label>
				</li>
	<?php endforeach;
	}
	else
		{
			?> You Do Not have Folder Access<?php
			}?>
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

	if ( (!current_user_can( 'edit_user')) || (get_current_user_id()==$user->ID) )
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
