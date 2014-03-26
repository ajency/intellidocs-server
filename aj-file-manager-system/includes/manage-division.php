<div class="wrap">
<div  ></div>
<h2>Manage Division</h2>
<div class="updated below-h2" id="message"  >

</div>
</div>

<form>   
   <table border="0" width="100%"title="Manage Groups" class="wp-list-table"  >  
     
  <tr>  
         <td width="595"  >
		 
		 <div id="message" >
			 
		 </div>
		 
		</td> 
            	  
     </tr>		
		 <tr>  
         <td width="595"  >
		 <strong>Select Division: </strong>
		 <div id="get_groups">
		 <select name="division" id="division">
		<?php get_selectbox_division();?>
		</select>
		</div>
		</td> 
             	  
     </tr>
	   <tr>  
         <td width="595"  height="20" id="row-default_div"  > 
		</td> 
            	  
     </tr>
     </table>
	 <table border="0" width="100%"title="Manage Groups" class="wp-list-table"  >  
	 <tr id="row-division-members">  
         <td width="50%" valign="top"  >
		 <strong><h3>Division Members:</h3></strong>
		 <div id="available_division"   class="dmtDocumentStructureWrapper">
			 
		 </div><br>
		 <div id="available_division_add" style="display: inline" class="available_users_add">
			<input id="add-user-division-button" type="button" value="Add / Remove Division Members" class="button button-primary add-user-group-button">
			<input style="display: none" id="save-user-division-button" type="button" value="Save Division Members" class="button button-primary save-user-group-button">
		 </div>
		</td> 
            	  
   <!-- </tr>
	    
	  <tr id="row-folder-visibility">   
         <td colspan="2"  valign="top">
		 <strong><h3>Folder Visibility:</h3></strong><br> 
		  <div id="available_group_folder" class="available_group_folder" style="display: inline">
			<input id="add-group-folder-button" type="button" value="Add / Remove Group Folders" class="button button-primary add-group-folder-button">
			<input id="save-group-folder-button" style="display: none" type="button" value="Save Group Folders" class="button button-primary save-group-folder-button">
		 </div>
		 <br>
		 <br>
		 <div id="group_folder" class="dmtDocumentStructureWrapper">
		</div><br>
		  <div id="available_group_folder" class="available_group_folder"  style="display: inline">
			<input id="add-group-folder-button"  type="button" value="Add / Remove Group Folders" class="button button-primary add-group-folder-button">
			<input id="save-group-folder-button" style="display: none" type="button" value="Save Group Folders" class="button button-primary save-group-folder-button">
		 </div>
		</td> 
            	  
     </tr> --> 
	     <tr>  
         <td width="595"  height="20">  
		</td> 
            	  
     </tr>
	
    </table>  
	</form>
	<div id="processing-img" style="display:none"><img src="<?php echo WP_PLUGIN_URL. '/aj-file-manager-system/img/loading.gif';?>"></div> 