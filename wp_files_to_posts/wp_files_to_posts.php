<?php
/*
 *  Plugin Name: File Uploader.
	Plugin URI: http://www.wasptech.com
	Description: Used to create a new settings page for uploading files as posts to particular categories.
	Version: 0.0.1	Alpha
	Author: Donal Moran
	Author URI: http://www.wasptech.com
*
*/

//Register the custom menu page for adding new files as posts.
add_action('admin_menu', 'pp_register_add_files_menu_page');
function pp_register_add_files_menu_page() {
	add_menu_page( 'Add Multiple Documents', 'Add Multiple Documents', 'read', 'press-port-add-file-page', 'pp_add_files_screen_callback',plugin_dir_url( __FILE__ ).'img/add-file.png',4);
}

function pp_enqueue_scripts_and_styles($hook) {
   if(!preg_match('/press-port-add-file-page/',$_SERVER['QUERY_STRING']))
        return;
	wp_enqueue_style ( 'pp_plupload_css',plugins_url('/css/jquery.plupload.queue.css', __FILE__) );	
	wp_enqueue_style ( 'pp_plupload_custom_css',plugins_url('/css/custom.css', __FILE__) );	
	
    wp_enqueue_script( 'pp_plupload', plugins_url('/js/plupload.js', __FILE__) );
	wp_enqueue_script( 'pp_plupload_html5', plugins_url('/js/plupload.html5.js', __FILE__) );
	wp_enqueue_script( 'pp_jquery_plupload_queue', plugins_url('/js/jquery.plupload.queue.js', __FILE__) );
	wp_enqueue_script( 'pp_jquery_plupload_admin_script', plugins_url('/js/plupload_admin_page.js', __FILE__) );
	
}
add_action( 'admin_enqueue_scripts', 'pp_enqueue_scripts_and_styles' );

//unregister the Add Files option from the submenu
function pp_remove_add_new_submenus() {
	global $submenu; 
 	unset($submenu['edit.php?post_type=document_files'][10]); // Removes 'Add New'.
}
//add_action('admin_menu', 'pp_remove_add_new_submenus');

//Hide the Add Files option from the header
function pp_remove_add_new_header() {
	global $typenow, $current_screen;

    if('document_files' == $typenow)
  	echo '<style type="text/css">
    #favorite-actions {display:none;}
    .add-new-h2{display:none;}
    </style>';
}
add_action('admin_head', 'pp_remove_add_new_header');

//This is where the HTML for the file uploader will go.
function pp_add_files_screen_callback() {
	
	echo '<h3>Add Multiple Documents</h3>';?>
	
    <form method="post" action="">
    <div class="ppFolderStructure"> 
        <div class="ppFolderStructureUl">
        <div class="plupload_header">
        	<div class="plupload_header_content">
            	<div class="plupload_header_title">Select folders</div>
            	<div class="plupload_header_text">These are the folders to which the files will be added.</div>
         	</div>
        </div>
    	<div class="ppFolderStructureUlwrapper">
        <ul class="folder-root">
		<?php 
		$nested_args= array(
			'descendants_and_self' => 0,
			'selected_cats' => false ,
			'popular_cats' => false,
			'walker' => null,
			'taxonomy' => 'document_folders',
			'checked_ontop' => false,); 
		
	 	echo wp_terms_checklist_return_html(0, $nested_args);?>
    	</ul>
        </div>
        <div class="plupload_filelist_footer">
          	<div class="plupload_file_name">
            	<div class="plupload_buttons">
                <a href="#" class="plupload_button pp_add_folder pp_add_folder_2" id="html5_pp_add_folder" style="position: relative; z-index: 0; "> Next</a>
            	</div>
        	</div>
       </div>
      </div>
    </div> 
    
    <div id="ppUploader" style="float: left; margin-right: 20px">
		<div id="html5_uploader" style="width: 600px; height: 330px;">You browser doesn't support native upload. Try Firefox 3 or Safari 4.</div>
	</div>
    <div class="clearfix"></div>
    <div class="ppResetSettings ppResetHide" id="ppResetSettings" title="Reset the folders to which the files are uploaded to."><span class="ppIconReset">&nbsp;</span><span class="ppResetSettingsText">Reset</span></div>
	<div class="ppResetQueue ppResetHide" id="ppResetQueue" title="Clear the file upload queue."><span class="ppIconQueueReset">&nbsp;</span><span class="ppResetQueueText">Clear Queue</span></div>
	
    <br style="clear: both" />
</form>
<style>
	 	a {
    color: #000000;
    cursor: pointer;
    text-decoration: none;
}
	 	</style>
<script type="text/javascript">
jQuery(document).ready(function(){
	jQuery(function() {
	    // Find list items representing folders and
	    // style them accordingly.  Also, turn them
	    // into links that can expand/collapse the
	    // tree leaf.
	   jQuery('li > ul').each(function(i) {
	        // Find this list's parent list item.
	        var parent_li = jQuery(this).parent('li');

	        // Style the list item as folder.
	        parent_li.addClass('folder');

	        // Temporarily remove the list from the
	        // parent list item, wrap the remaining
	        // text in an anchor, then reattach it.
	        var sub_ul =jQuery(this).remove(); 
	        termcheckbox = parent_li.find('label :first-child'); 
			parent_li.find('label :first-child').remove()
			labelcontent = parent_li.find('label').html();
			parent_li.html(labelcontent) 
	        parent_li.wrapInner('<a/>')
			termlabel = (parent_li.html())
			parent_li.html(termcheckbox)
			parent_li.append(termlabel)	
			parent_li.find('a').click(function() {
	            // Make the anchor toggle the leaf display.
	            sub_ul.toggle();
	        }); 		
	        parent_li.append(sub_ul);
	    });

	    // Hide all lists except the outermost.
	   jQuery('ul ul').hide();
	});
	});
jQuery(document).ready(function() {

	var settings = {
		// General settings
		runtimes : 'html5',
		url : '<?php echo plugins_url('/includes/upload.php', __FILE__)?>',
		max_file_size : '10mb',
		chunk_size : '1mb',
		unique_names : false,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"},
			{title : "Zip files", extensions : "zip"},
			{title : "Document Files",extensions:"pdf,doc,docx,xls,xlsx,ppt,pptx"},
		],
		resize : false
	};
	
	jQuery('#html5_pp_add_folder').click(function(event){
		event.preventDefault();
		var folders = pp_get_folders_selected();
		if(!(folders.length == 0))
		{
			settings.multipart_params = {'folders': folders};
			jQuery("#html5_uploader").pluploadQueue(settings);
			pp_disable_folders_selected();
			jQuery('#ppUploader').show();
			jQuery('#ppResetSettings').removeClass('ppResetHide');
			jQuery('#ppResetQueue').removeClass('ppResetHide');
			jQuery(this).hide();
		}
		else
		{
			alert('Please choose folder(s) before going forward');
		}
		});
});
</script>
<?php }