<?php 



 $walker = new tcb_Walker_Category_Radiolist;

?>
<div class="wrap">
<div  ></div>
<div id="icon-edit" class="icon32 icon32-posts-document_files"><br></div>
<h2>Document Folders</h2>
<div class="updated below-h2" id="message"  >

</div>
</div>
<br>
<br>
<form>   
   <table border="0" width="100%"title="Manage Groups" class="wp-list-table"  >  
     
  		<tr>  
	         <td colspan="2"  >
			 
			 <div id="message" >
				 
			 </div> 
			</td> 
            	  
     	</tr>		
		<tr>  
	         <td  valign="top" > 
	         <label for="tag-name"><?php _ex('Name', 'Taxonomy Name'); ?></label>
	         </td>
	         <td>
	         <input name="tag-name" id="tag-name" type="text" value="" size="40" aria-required="true" />
					<p><?php _e('The name is how it appears on your site.'); ?></p>
	         </td>
         
        </tr>
        
        <tr>  
	         <td   valign="top"> 
	       		<label for="parent"><?php _ex('Parent', 'Taxonomy Parent'); ?></label>
	         </td>
	         <td> 
	         <div >
    <div class="ppFolderStructure-document-folder"> 
        <div class="ppFolderStructureUl">
        <div class="plupload_header">
        	<div class="plupload_header_content">
            	<div class="plupload_header_title">Select folders</div>
            	<div class="plupload_header_text">These are the folders to which the files will be added.</div>
         	</div>
        </div>
    	<div class="ppFolderStructureUlwrapper-document-folder">
        <ul class="folder-root">
		<?php 
		$nested_args= array(
			'descendants_and_self' => 0,
			'selected_cats' => array(71) ,
			'popular_cats' => array(71),
			'walker' => $walker,
			'taxonomy' => 'document_folders',
			'checked_ontop' => false,); 
			 
	 	echo wp_terms_checklist_return_html(0, $nested_args);?>
    	</ul>
        </div>
        <div class="plupload_filelist_footer">
          	<div class="plupload_file_name">
            	 
        	</div>
       </div>
      </div>
    </div> 
    
  
<style>
	 	a {
    color: #000000;
    cursor: pointer;
    text-decoration: none;
}
	 	</style>
	 	</div>
	         </td>
         
        </tr>
        
        <tr>  
	         <td  valign="top"> 
	         	<label for="tag-description"><?php _ex('Description', 'Taxonomy Description'); ?></label>
	         </td>
	         <td>
	        	<textarea name="description" id="tag-description" rows="5" cols="40"></textarea>
					<p><?php _e('The description is not prominent by default; however, some themes may show it.'); ?></p>
	         </td>
         
        </tr>
 
    
 
	     <tr>  
         <td colspan="2"  height="20">  
             <div id="available_document-folderr" class="available_document-folder"  style="display: inline">
				<input id="add-document-folder" type="button" value="Add New Document Folder" class="button button-primary add-document-folder-button">
		 	 </div> 
		</td> 
            	  
     </tr>
	
    </table>  
	</form>
	<div id="processing-img" style="display:none"><img src="<?php echo WP_PLUGIN_URL. '/aj-file-manager-system/img/loading.gif';?>"></div> 
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
</script>