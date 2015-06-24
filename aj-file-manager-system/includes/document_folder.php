<div class="wrap">
<div id="icon-edit" class="icon32"></div>
<h2>Document Folders</h2>
</div>
<br>
<br>
<?php
 
function aj_get_document_folder_structure_subs()
{
	$args = array('hide_empty' => 0);
	$terms = get_terms('document_folders',$args);
	
	$terms = aj_get_nested_docment_folders_sub('document_folders',0,0,1);
	
	$screen 	= get_current_screen();
	$tax_url 	= 'admin.php?page=list-document-folder'; 
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
<?php $cls = dmtFolderSortDirectionCls_sub();?>
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
	<?php aj_render_document_folder_structure_subs($terms);?>
</ul>
 
</div>
<?php 
}
 aj_get_document_folder_structure_subs();

/**
 * Function to recurssively generate a li ul structure for terms
 * @param array $children The term children
 */
function aj_render_document_folder_structure_subs($children)
{
	global $post_type;
	
	if($children):
?>
<?php foreach ($children as $child):?>
		<li>
			<span class="folder">
				<a href="" id="dmtFolderTreeItem-<?php echo $child['id'];?>"><?php echo $child['name'];?>
					 	
				</a>
			</span>	
			<div class="dmtDisplayNone" id="dmtFolderTreeItemMeta-<?php echo $child['id'];?>">
				
				<h3><?php echo $child['name'];?></h3>
				
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
					<span class="dmtFolderMeta dmtFolderFilesCount"><a href="admin.php?page=manage-document&folder=<?php echo $child['id'] ?>">Files: <?php echo $child['count'];?></a>  
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
         			<?php aj_render_document_folder_structure_subs($child['children']);?>
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
function dmtAddTaxonomyQueryToWpQuery_sub($query)
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
add_action('pre_get_posts','dmtAddTaxonomyQueryToWpQuery_sub');
/**
 * Function to return a nested structure of taxonomy terms
 * @param string $taxonomy The custom taxonomy to be queried.
 * @param int $parent The id of the parent term for the current term.
 * @param int $child_of The id of the current term.
 */
function aj_get_nested_docment_folders_sub($taxonomy,$parent,$child_of,$level=0)
{
 

	$args = array('hide_empty' => 0,'get' => 'all', 'orderby' => 'id','parent' => $parent,'child_of' => $child_of);
	
	$terms = get_terms($taxonomy,$args);
	//if(intval($term->parent)==0 ){
	foreach ( $terms as $term) {
	$display=1;
		if($parent==0){
			global $user_ID;
		 
			$accesscategory = dmt_get_current_user_folders();			
			if(!in_array($term->term_id,$accesscategory))
			{
			  $display=0;
			}
		  
		  
		 }
		 if($display==1)
		 {
			if(dmt_check_folder_status_is_published($term->term_id))
			{
				$children[] = array(
								'id' 			=> $term->term_id,
								'item_number'	=> aj_get_item_number_document_folder_sub($term->term_id),
								'name' 			=> $term->name,
								'count' 		=> $term->count,
								'desc'			=> $term->description,
								'slug'			=> $term->slug,
								'parent'		=> $term->parent,
								'taxonomy'		=> $term->taxonomy,
								'children'		=> aj_get_nested_docment_folders_sub($taxonomy,$term->term_id,$child_of,$level),
								);
				}
			}				 
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
function aj_get_item_number_document_folder_sub($folder_id)
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
function aj_manage_document_folders_scripts_sub()
{
	var_dump("test");
	$current_screen = get_current_screen();

	if($current_screen->id == 'edit-document_folders')
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
function aj_manage_document_folders_styles_sub()
{
	$current_screen = get_current_screen() ;
	if($current_screen->id == 'edit-document_folders')
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
add_action('admin_print_scripts', 'aj_manage_document_folders_scripts_sub');
add_action('admin_print_styles', 'aj_manage_document_folders_styles_sub');

//////////////////////////SOME ADDITIONAL FUNCTIONS BASED ON THE FILE MANGER PLUGIN//////////////////////////////

/**
 * Function to check if a folder is published.
 * @param int $folder_id
 */
 
/**
 * Function to check if a folder is activated.
 * @param int $folder_id
 */
function dmtFolderActivatedCheck_sub($folder_id)
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

function dmtFolderSortDirectionCls_sub()
{
	if(!isset($_GET['idsrtdir']) ||  $_GET['idsrtdir'] == 'ASC')	
		return array('asc'=> 'active','desc' =>'');
	
	elseif(isset($_GET['idsrtdir']) &&  $_GET['idsrtdir'] == 'DESC')
		return array('asc'=> '','desc' =>'active');
	
}

