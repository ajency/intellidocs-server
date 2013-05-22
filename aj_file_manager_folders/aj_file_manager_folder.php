<?php
/*
Plugin Name:File Folder Manager
Plugin URI: http://www.wasptech.com
Description: A document folder view system.
Version: 1.0.0
Author: Donal Moran
Author URI: http://www.wasptech.com
License: GPL3
*/

/**
 * Function to add the folder structure view inside the edit-document_folders page.
 */
function aj_get_document_folder_structure()
{
	$args = array('hide_empty' => 0);
	$terms = get_terms('document_folders',$args);
	
	$terms = aj_get_nested_docment_folders('document_folders',0,0);
	
	$screen 	= get_current_screen();
	$tax_url 	= 'edit-tags.php?taxonomy='.$screen->taxonomy.'&post_type='.$screen->post_type; 
	?>
<div id="dmtFolderStructreWrapper">
<script type="text/javascript">
jQuery(document).ready(function(){
	
	jQuery("#navigation").treeview({
		persist: "location",
		control: "#treecontrol",
		collapsed: true,
		unique: true
	}); 
	
	 jQuery('#treecontrol a:eq(0)').click();
 
    
});
</script>
<?php $cls = dmtFolderSortDirectionCls();?>
	<div class="dmtFolderSortNav">
		<div class="dmtFolderSorter">
			<span class="description">Sort folders by item id: </span>
			<div class="btn-group dmtFolderSort">
				<a class="btn btn-mini <?php echo $cls['asc']?>" href="<?php echo $tax_url.'&idsrtdir=ASC'?>" title="Sort by Item ID ascending.">
					<i class="icon-arrow-up"></i>
				</a>
				<a class="btn btn-mini <?php echo $cls['desc']?>" href="<?php echo $tax_url.'&idsrtdir=DESC'?>" title="Sort by Item ID descending.">
					<i class="icon-arrow-down"></i>
				</a>
			</div>
		</div> 
		
	</div>
	<div id="treecontrol"><a href="#"></a><a href="#"></a><a href="#"></a>
</div>
	<ul id="navigation" class="filetree">
	<?php aj_render_document_folder_structure($terms);?>
</ul>
 
</div>
<?php 
}
 //add_action('document_folders_add_form', 'aj_get_document_folder_structure'); //comment this to disable old tree view

/**
 * Function to recurssively generate a li ul structure for terms
 * @param array $children The term children
 */
function aj_render_document_folder_structure($children)
{
	global $post_type;
	
	if($children):
?>
<?php foreach ($children as $child):?>
		<li>
			<span class="folder">
				<a href="" id="dmtFolderTreeItem-<?php echo $child['id'];?>"><?php echo $child['name'];?>
					<span class="dmtFolderStatusInfo">
					(
						<?php echo dmtFolderPublishedCheck($child['id']).' | ';?>
						<?php echo dmtFolderActivatedCheck($child['id']);?>
					)
					</span>	
				</a>
			</span>	
			<div class="dmtDisplayNone" id="dmtFolderTreeItemMeta-<?php echo $child['id'];?>">
				
				<h3><a href="<?php echo  esc_url( get_edit_term_link( $child['id'], $child['taxonomy'], $post_type ));?>"><?php echo $child['name'];?></a></h3>
				
				<?php if($child['item_number']):?>
					<h5><span class="description">Item Number: <?php echo $child['item_number']; ?></span></h5>
				<?php endif;?>
				
				<?php if($child['desc']):?>
					<p class="dmtFolderDescription"><span class="description">Description: </span><?php echo $child['desc'];?></p>
				<?php endif;?>
				
				<div class="dmtFolderActions">
					<?php /** Arguments needed to passed in the url must contain the necessary parameters by which to filter the posts. Used
							by function dmtAddTaxonomyQueryToWpQuery**/?>
					<?php $args = array('post_type'=> $post_type,'dmtNoTaxChild' => true,'dmtTax' => $child['taxonomy'],'dmtTaxSlug' => $child['slug']);?>
					<span class="dmtFolderMeta dmtFolderFilesCount"><a href="<?php echo  esc_url ( add_query_arg( $args, 'edit.php' ) )?>">Files: <?php echo $child['count'];?></a> |</span>
					<span class="dmtFolderMeta"><a href="<?php echo  esc_url( get_edit_term_link( $child['id'], $child['taxonomy'], $post_type ));?>">Edit</a> |</span>
					<span class="dmtFolderMeta"><a href="<?php echo  wp_nonce_url( "edit-tags.php?action=delete&amp;taxonomy=".$child['taxonomy']."&amp;tag_ID=".$child['id'], 'delete-tag_' . $child['id'] );?>" class="delete">Delete</a></span>
					<?php do_action('dmtFolderMetaActions', $child['id']);?>
				</div>	
				<span class="dmtToolTipPointer">&nbsp;</span>
			</div>
			<script type="text/javascript">
				jQuery(document).ready(function(){
						jQuery('a#dmtFolderTreeItem-<?php echo $child["id"];?>').aToolTip({
								clickIt: true, 
								tipContent: jQuery('div#dmtFolderTreeItemMeta-<?php echo $child["id"];?>').html(),
								toolTipClass: 'dmtFolderToolTip',
								xOffset: -30,  
						        yOffset: 10,
								});
						});
		</script>
         	<?php if (count($child['children']) > 0):?>
         		<ul>
         			<?php aj_render_document_folder_structure($child['children']);?>
         		</ul>
         	<?php endif;?>
       </li> 
<?php endforeach; ?>
<?php
 	else:
 		echo 'NO FOLDERS FOUND.';
	endif;	
}
/**
 * Function to overide the default wordpress behaviour to not get child taxonomy term posts for a particular taxonomy term.
 * @param object $query The query object before being parsed in the WP_Query Class.
 */
function dmtAddTaxonomyQueryToWpQuery($query)
{
	if(isset($_GET['dmtNoTaxChild']) && isset($_GET['dmtTax']))
	{
		$query->set('tax_query', array
									(
										array(
										'taxonomy' 			=> $_GET['dmtTax'],
										'field' 			=> 'slug',
										'terms' 			=> array($_GET['dmtTaxSlug']),
										'include_children' 	=> false,		 
									 	)
									 )
					);
		unset($_GET['dmtNoTaxChild']);
	}
	return $query;
}
add_action('pre_get_posts','dmtAddTaxonomyQueryToWpQuery');
/**
 * Function to return a nested structure of taxonomy terms
 * @param string $taxonomy The custom taxonomy to be queried.
 * @param int $parent The id of the parent term for the current term.
 * @param int $child_of The id of the current term.
 */
function aj_get_nested_docment_folders($taxonomy,$parent,$child_of)
{
	$args = array('hide_empty' => 0,'get' => 'all', 'orderby' => 'id','parent' => $parent,'child_of' => $child_of);
	
	$terms = get_terms($taxonomy,$args);
	
	foreach ( $terms as $term) {
	
			$children[] = array(
								'id' 			=> $term->term_id,
								'item_number'	=> aj_get_item_number_document_folder($term->term_id),
								'name' 			=> $term->name,
								'count' 		=> $term->count,
								'desc'			=> $term->description,
								'slug'			=> $term->slug,
								'parent'		=> $term->parent,
								'taxonomy'		=> $term->taxonomy,
								'children'		=> aj_get_nested_docment_folders($taxonomy,$term->term_id,$child_of),
								);
	}
	if(count($children) > 0)
	{
		foreach ($children as $key => $row) {
			$item_id[$key]  = $row['item_number'];
		}
		switch($_GET['idsrtdir'])
		{
			case 'ASC':
				array_multisort($item_id, SORT_ASC,$children);
				break;
			case 'DESC':
				array_multisort($item_id, SORT_DESC,$children);
				break;
			default:
				array_multisort($item_id, SORT_ASC,$children);
		}
	}
	return $children;
}
/**
 * Function to fetch the item number associated with a folder.
 * @param int $folder_id
 * @return int|string
 */
function aj_get_item_number_document_folder($folder_id)
{
	if(function_exists('dmt_get_document_folder_meta'))
	{
		$item_number =  dmt_get_document_folder_meta($folder_id,'document_folders_item_id');
		if($item_number)
			return $item_number;
		else
			return 'Not Set';
	}
	else 
		return 'Not Set';
	
}
/**
 * Function to enqueue scripts for document folders.
 */
function aj_manage_document_folders_scripts()
{
	$current_screen = get_current_screen();
	if($current_screen->id == 'edit-document_folders' || $current_screen->id == 'intellidocs-document-files')
	{
		wp_register_script('dmt-manage-folder-cookie-js',plugins_url('/js/jquery.cookie.js',__FILE__));
		wp_enqueue_script('dmt-manage-folder-cookie-js');

		wp_register_script('dmt-manage-folder-treeview-js',plugins_url('/js/jquery.treeview.js',__FILE__));
		wp_enqueue_script('dmt-manage-folder-treeview-js');

		wp_register_script('dmt-manage-folder-atooltip-js',plugins_url('/js/jquery.atooltip.min.js',__FILE__));
		wp_enqueue_script('dmt-manage-folder-atooltip-js');
		
		wp_register_script('dmt-manage-folder-structure-js',plugins_url('/js/dmtFolderStructureModel.js',__FILE__));
		wp_enqueue_script('dmt-manage-folder-structure-js');

	}
}
/**
 * Function to enqueue styles for document folders.
 */
function aj_manage_document_folders_styles()
{
	$current_screen = get_current_screen() ;
	if($current_screen->id == 'edit-document_folders' || $current_screen->id == 'intellidocs-document-files')
	{
		wp_register_style( 'dmt-manage-folder-treeview',  plugins_url('/css/jquery.treeview.css', __FILE__ ) );
		wp_enqueue_style( 'dmt-manage-folder-treeview' );

		wp_register_style( 'dmt-manage-folder-atooltip',  plugins_url('/css/atooltip.css', __FILE__ ) );
		wp_enqueue_style( 'dmt-manage-folder-atooltip' );

		wp_register_style( 'dmt-manage-folder-custom',  plugins_url('/css/dmtFolderManager.css', __FILE__ ) );
		wp_enqueue_style( 'dmt-manage-folder-custom' );
		
		wp_register_style( 'dmt-manage-folder-bootstrap',  plugins_url('/css/bootstrap.min.css', __FILE__ ) );
		wp_enqueue_style( 'dmt-manage-folder-bootstrap' );
		
	}
}
add_action('admin_print_scripts', 'aj_manage_document_folders_scripts');
add_action('admin_print_styles', 'aj_manage_document_folders_styles');

//////////////////////////SOME ADDITIONAL FUNCTIONS BASED ON THE FILE MANGER PLUGIN//////////////////////////////

/**
 * Function to check if a folder is published.
 * @param int $folder_id
 */
function dmtFolderPublishedCheck($folder_id)
{
	if(function_exists('dmt_check_folder_status_is_published'))
	{
		if(dmt_check_folder_status_is_published($folder_id))
		{
			return '<span class="dmtFolderGreen">Published</span>';
		}
		return '<span class="dmtFolderRed">Unpublished</span>';
	}
	return false;
}
/**
 * Function to check if a folder is activated.
 * @param int $folder_id
 */
function dmtFolderActivatedCheck($folder_id)
{
	if(function_exists('dmt_check_folder_is_deactivated'))
	{
		if(dmt_check_folder_is_deactivated($folder_id))
		{
			return '<span class="dmtFolderRed">Deactivated</span>';
		}
		return '<span class="dmtFolderGreen">Activated</span>';
	}
	return false;
}

function dmtFolderSortDirectionCls()
{
	if(!isset($_GET['idsrtdir']) ||  $_GET['idsrtdir'] == 'ASC')	
		return array('asc'=> 'active','desc' =>'');
	
	elseif(isset($_GET['idsrtdir']) &&  $_GET['idsrtdir'] == 'DESC')
		return array('asc'=> '','desc' =>'active');
	
}

//*****************************************************
//NEW UPDATES FOR THE DOCUMENT FOLDER TO BE ADDED HERE.
//*****************************************************

function intellidocs_tree_view_scripts(){

	wp_register_style( 'intellidocs-folder-tree-css',  plugins_url('/css/jqueryFileTree.css', __FILE__ ) );
	wp_enqueue_style( 'intellidocs-folder-tree-css' );
	
	wp_register_style( 'intellidocs-font-awesome',  plugins_url('/css/font-awesome.min.css', __FILE__ ) );
	wp_enqueue_style( 'intellidocs-font-awesome' );
	
	wp_register_style( 'intellidocs-font-awesome-ie7',  plugins_url('/css/font-awesome-ie7.min.css', __FILE__ ) );
	wp_enqueue_style( 'intellidocs-font-awesome-ie7' );

	wp_register_script('intellidocs-folder-tree-js',plugins_url('/js/jqueryFileTree.js',__FILE__));
	wp_enqueue_script('intellidocs-folder-tree-js');
}
add_action('admin_head','intellidocs_tree_view_scripts');

//create a new folder menu under the custom post type.
add_action('admin_menu', 'intellidocs_folder_page');
function intellidocs_folder_page(){
	$page_title			= 'Document Folders';
	$menu_title			= 'Document Folders';
	$menu_capability 	= 'read';
	$menu_slug			= 'intellidocs-document-files';
	$menu_function 		= 'intellidocs_folder_display'; 
	add_submenu_page('edit.php?post_type=document_files',$page_title,$menu_title,$menu_capability,$menu_slug,$menu_function);
}

//Function to display the folder structure.
function intellidocs_folder_display(){
		
		global $current_user;
		get_currentuserinfo();
	?>
	<div class="wrap">
		<h2><i class="icon-list"></i>&nbsp;Intellidocs Folders</h2>
		<span class="description">Folders visible to <?php echo $current_user->display_name; ?></span>
		<hr>
		<div id="intellidocsFolderStructure" class="demo"></div>	
		<script>
		jQuery(document).ready(function(){
		
			jQuery('#intellidocsFolderStructure').fileTree({ 
				root: '/', 
				script: ajaxurl, 
				folderEvent: 'click',
				expandSpeed: 750, 
				collapseSpeed: 750, 
				multiFolder: false 
				}, 
				function(file,folder) { 
					var url = '<?php echo admin_url('admin.php')?>?page=download-file&filename='+ file +'&folder='+ folder;
					window.open(url, '_blank');
					window.focus();
				});
			jQuery('ul.jqueryFileTree li.file').live('mouseover',function(){jQuery(this).addClass('show-options')});
			jQuery('ul.jqueryFileTree li.file').live('mouseout ',function(){jQuery(this).removeClass('show-options')});
			jQuery('ul.jqueryFileTree li.directory').live('mouseover',function(){jQuery(this).addClass('show-options')});
			jQuery('ul.jqueryFileTree li.directory').live('mouseout ',function(){jQuery(this).removeClass('show-options')});
			
			jQuery('ul.jqueryFileTree li.file span.edit-file').live('click',function(){window.open(jQuery(this).attr('rel'),'_blank');window.focus()});
			jQuery('ul.jqueryFileTree li.directory span.edit-folder').live('click',function(){window.open(jQuery(this).attr('rel'),'_blank');window.focus()});			
		});
		</script>
	</div>
	<?php
}
function aasort (&$array, $key) {
	$sorter=array();
	$ret=array();
	reset($array);
	foreach ($array as $ii => $va) {
		$sorter[$ii]=$va[$key];
	}
	asort($sorter);
	foreach ($sorter as $ii => $va) {
		$ret[$ii]=$array[$ii];
	}
	$array=$ret;

	return $array;
}

function intellidocs_sort_folders($cats)
{
	$cats_arr = array();
	$cats_arr_sort_by_itemid = array();
	$cats_arr_sort_by_name = array();
	$cats_sorted = array();
	foreach($cats as $cat){
	
		$document_folders_item_id = dmt_get_document_folder_meta($cat->term_id,'document_folders_item_id');
	
		if($document_folders_item_id !="")
		{
			$cats_arr_sort_by_itemid[] = array('cats'=>$cat,'term'=>$document_folders_item_id);
		}
		else
		{
			$cats_arr_sort_by_name[] = array('cats'=>$cat,'name'=>$cat->name);
		}
	}
	
	$cats_arr_sort_by_itemid =  aasort($cats_arr_sort_by_itemid,'term');
	$cats_arr_sort_by_name =  aasort($cats_arr_sort_by_name,'name');
	$cats_arr = array_merge($cats_arr_sort_by_itemid, $cats_arr_sort_by_name);
	foreach($cats_arr as $cat){
		$cats_sorted[] = ($cat['cats']);
	}
	return $cats_sorted;
}

function intellidocs_sort_files($files)
{
	$files_arr = array();
	$files_arr_sort_by_itemid = array();
	$files_arr_sort_by_name = array();
	$files_sorted = array();
	foreach($files as $file){
 
		$item_id		= get_post_meta($file->ID,'dmt_file_item_number',true);
			
		if($item_id !="")
		{
			$files_arr_sort_by_itemid[] = array('files'=>$file,'term'=>$item_id);
		}
		else
		{
			$files_arr_sort_by_name[] = array('files'=>$file,'name'=>$file->post_title);
		}
	}

	$files_arr_sort_by_itemid =  aasort($files_arr_sort_by_itemid,'term');
	$files_arr_sort_by_name =  aasort($files_arr_sort_by_name,'name');
	$files_arr = array_merge($files_arr_sort_by_itemid, $files_arr_sort_by_name);
	foreach($files_arr as $file){
		$files_sorted[] = ($file['files']);
	}
	return $files_sorted;
}
//Function to create the folder structure.
function intellidocs_document_folder_structure($catid = null)
{	
	global $wpdb;
	$html  = '';
	$catid = (!empty($catid))?$catid:0;
			
	if($catid == 0 && !current_user_can('publish_posts'))
	{
		global $current_user;
		get_currentuserinfo();
		$userid  = $current_user->ID;
		$user_access_table 	= $wpdb->prefix . "dmt_user_cat_access_data";
		$user_group 		= $wpdb->prefix . "dmt_user_group";
		$group_folder 		= $wpdb->prefix . "dmt_group_folder";
		
		//categories user has access to 
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
			if(dmt_check_folder_status_is_published($access_cat->category_id))
			{
				$cats[] = get_term_by( 'id', $access_cat->category_id , 'document_folders');
				//$html .=  intellidocs_folder_html($cat);
			}
		}
		$cats = intellidocs_sort_folders($cats);
		foreach($cats as $cat){
		
			$html .=  intellidocs_folder_html($cat);
		}
		
		
		return $html;
	}
	else
	{
		$args  = array(
						'type'                     => 'post',
						'child_of'				   => 0,
						'parent'                   => $catid,	
						'orderby'                  => 'name',
						'order'                    => 'ASC',
						'hide_empty'               => 0,
						'hierarchical'             => 1,
						'taxonomy'                 => 'document_folders',
						'pad_counts'               => true);				
		
		//Create the category folder structure.	
		$cats  = get_categories($args); 
		//function to sort folders by item_id , if no itemid then by name
		$cats = intellidocs_sort_folders($cats);
		foreach($cats as $cat){

			$html .=  intellidocs_folder_html($cat);
		}
		//File html.
		$html .= intellidocs_file_html($catid);
		
		return $html;
	}
}



//Function to create folder tree html
function intellidocs_folder_html($cat)
{
		$html ='';
		

		$folder_edit_html 	   	= (current_user_can('manage_options')||dmt_get_current_user_role() =="dmt_site_admin")? '&nbsp;&nbsp;<span class="edit-folder" title="Edit folder" rel="'.admin_url().'edit-tags.php?action=edit&taxonomy=document_folders&tag_ID='.$cat->term_id.'&post_type=document_files'.'"><i class="icon-pencil"></i>Edit</span>&nbsp;&nbsp; <i class="icon-trash"></i><a href="javascriot:void(0)" rel="'.admin_url().wp_nonce_url( "edit-tags.php?action=delete&amp;taxonomy=document_folders&tag_ID=".$cat->term_id, 'delete-tag_' . $cat->term_id ).'"  folder-name ="'.$cat->name.'" class="delete-folder">Delete</a>':'';
		$folder_edit_html_additional_parameters 	   	= apply_filters('intellidocs_etc_action', admin_url(),$cat->term_id);
		$folder_edit_html = $folder_edit_html.$folder_edit_html_additional_parameters;
		$folder_item_id			= intellidocs_get_folder_item_id($cat->term_id);
		
		$sub_folder_count_html 	= '&nbsp;<span class="sub-folder-count" title="Sub folder count"><i class="icon-folder-close-alt"></i>'.intellidocs_get_subfolder_count($cat->term_id).'</span>';
		  $args = array('post_type'=> 'document_files','dmtNoTaxChild' => true,'dmtTax' => 'document_folders','dmtTaxSlug' => $cat->slug); 
		$file_count_html		= '&nbsp;<span class="file-count" title="File count"><i class="icon-file-alt"></i>'.intellidocs_get_folder_file_count($cat->term_id).'</span><span class="edit-folder" title="Edit folder" rel="'.admin_url().esc_url ( add_query_arg( $args, 'edit.php' ) ).'">(view files)</span>';
		
		$folder_publish_html	= intellidocs_folder_published($cat->term_id);
		
		$folder_active_html		= intellidocs_folder_activated($cat->term_id);
		
		$html .= '<li class="directory collapsed" data-catid="'.$cat->term_id.'">
					<a href="#" rel="">'.$cat->name.'</a>
					<span class="folder-options">
						'.$folder_item_id.$sub_folder_count_html.$file_count_html.$folder_publish_html.$folder_active_html.$folder_edit_html.'
					</span>
				 </li>';
		return	 	$html;	  
}

function intellidocs_file_html($catid)
{
	$html ='';
	//Create the file structure under current category.
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
								'terms' => $catid,
								'include_children' => false,
								)
						
						),	
				);
	$files = get_posts($files_args);
	$files = intellidocs_sort_files($files);
	foreach($files as $file)
		{
			$attachment_args = array(
					'post_type' => 'attachment',
					'numberposts' => -1,
					'post_status' => null,
					'post_parent' => $file->ID,
			);
			$attachments 	= get_posts($attachment_args);
			$file_attchment = wp_get_attachment_url($attachments[0]->ID);
			$ext			= intellidocs_get_file_extention($file->post_title);
			$attchment_cls	= ($file_attchment)?'has-attachment':'';
			
			$edit_html		= (current_user_can('manage_options'))? '&nbsp;&nbsp;<span class="edit-file" title="Edit file" rel="'.admin_url().'post.php?post='.$file->ID.'&action=edit'.'"><i class="icon-pencil"></i>Edit</span>':'';
			
			$item_id		= get_post_meta($file->ID,'dmt_file_item_number',true);
			$item_id_html 	= ($item_id)? '&nbsp;<span class="file-id" title="Item ID"><i class="icon-tags"></i>'. $item_id:'';
			
			$solicitor		= get_post_meta($file->ID,'dmt_file_solicitor',true);
			$solicitor_html 	= ($solicitor)? '&nbsp;<span class="file-solicitor" title="Solicitor"><i class="icon-user"></i>'. $solicitor:'';
			
			$html .= '<li class="file ext_'.$ext.' '.$attchment_cls.'">
			<a href="#" title="Double click to download file" data-filename="'.$file->ID.'" data-folder="'.$catid.'">'.$file->post_title.'</a>&nbsp;
			<span class="file-options">
			'.$item_id_html.$solicitor_html.$edit_html.'
			</span>
			</li>';
		}
	return $html;	
}


//Function to extract the file extentsion from file name
function intellidocs_get_file_extention($file_attchment){
	$extension =  pathinfo( $file_attchment, PATHINFO_EXTENSION );
	if ( $extension == '' )
		return '';
	return  $extension;
}
//Function to retrieve the sub folder count in folders.
function intellidocs_get_subfolder_count($cat_id){
	$sub_folders = get_terms( 'document_folders', array('child_of' => 0 ,'hide_empty' => false,'parent' => $cat_id) );
	return count($sub_folders);
}
//Function to retrieve the file count in folders.
function intellidocs_get_folder_file_count($cat_id)
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
									'terms' => $cat_id,
									'include_children' => false,
									)
							
							),	
					);
		$files = get_posts($files_args);
	return count($files);	
}

//Function to retrieve the item id html
function intellidocs_get_folder_item_id($cat_id)
{
	if(function_exists('dmt_get_document_folder_meta'))
	{
		$item_number =  dmt_get_document_folder_meta($cat_id,'document_folders_item_id');
		if($item_number)
			return  '&nbsp;<span class="folder-id" title="Item ID"><i class="icon-tags"></i>'. $item_number;
		else
			return '';
	}
	else 
		return '';
}
//Function to retrieve the publish status html
function intellidocs_folder_published($cat_id)
{
	if(function_exists('dmt_check_folder_status_is_published'))
	{
		if(dmt_check_folder_status_is_published($cat_id))
		{
			return '&nbsp;(<span class="folder-active">Published</span>';
		}
		return '&nbsp;(<span class="folder-deactive">Unpublished</span>';
	}
	return '&nbsp;(--';
}
//Function to retrieve the activated status html
function intellidocs_folder_activated($cat_id)
{
	if(function_exists('dmt_check_folder_is_deactivated'))
	{
		if(dmt_check_folder_is_deactivated($cat_id))
		{
			return '|<span class="folder-deactive">Deactivated</span>)';
		}
		return '|<span class="folder-active">Activated</span>)';
	}
	return '|--)';
}
//Ajax function to fetch the file tree
function intellidocs_fetch_tree(){
	
	$catid = $_POST['catid'];
	$html  = '<ul class="jqueryFileTree">';
	$html .= intellidocs_document_folder_structure($catid);
	$html .= '</ul>';
	echo $html;
	die();
}
add_action('wp_ajax_intellidocs_fetch_tree','intellidocs_fetch_tree');


function aj_manage_document_folders_scripts_filetreeview()
{
	var_dump("test");
	$current_screen = get_current_screen();
	  

		wp_register_script('dmt-manage-tree-folder-structure-js',plugins_url('/js/dmtTreeFolderStructureModel.js',__FILE__));
		wp_enqueue_script('dmt-manage-tree-folder-structure-js');

	 
}


add_action('admin_print_scripts', 'aj_manage_document_folders_scripts_filetreeview');
?> 
