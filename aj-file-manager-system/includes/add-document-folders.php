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
	       	<?php wp_dropdown_categories(array('hide_empty' => 0, 'hide_if_empty' => false, 'taxonomy' => 'document_folders', 'name' => 'parent', 'orderby' => 'name', 'hierarchical' => true, 'show_option_none' => __('None'))); ?>
					<?php if ( 'category' == $taxonomy ) : // @todo: Generic text for hierarchical taxonomies ?>
						<p><?php _e('Categories, unlike tags, can have a hierarchy. You might have a Jazz category, and under that have children categories for Bebop and Big Band. Totally optional.'); ?></p>
					<?php endif; ?>
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
           
				<input id="add-document-folder" type="button" value="Add New Document Folder" class="button button-primary add-document-folder-button">
		 	 
		</td> 
            	  
     </tr>
	
    </table>  
	</form>
	<div id="processing-img" style="display:none"><img src="<?php echo WP_PLUGIN_URL. '/aj-file-manager-system/img/loading.gif';?>"></div> 