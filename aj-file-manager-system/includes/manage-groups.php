<div class="wrap">
<div  ></div>
<h2>Manage Groups</h2>
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
		 <strong>Select Groups: </strong>
		 <div id="get_groups">
		 <select name="groups" id="groups">
		<?php get_group_select_box();?>
		</select>
		<div id="update-group-name" style="display: inline"><input type="text" name="group_name_update" id="group_name_update" value="">&nbsp;<input id="update-group-button"   type="button" value="Rename" class="button button-primary">&nbsp;&nbsp;<input id="remove-group-button"  type="button" value="x" class="button button-primary"></div>
		</div>
		</td> 
          <td width="250"  >
		 <strong>Group Name: </strong>
		  <div   style="display: inline">
			<input type="text" name="group_name"  id="group_name">
			</div>
			 <div id="add-group-name"  style="display: inline"><input id="add-group-button" type="button" value="Add" class="button button-primary">
			 </div>
		</td>    	  
     </tr>
	   <tr>  
         <td width="595"  height="20" id="row-default"  > 
		</td> 
            	  
     </tr>
	 
	 <tr id="row-group-members">  
         <td width="595"  >
		 <strong>Group Members:</strong><br> 
		 <div id="available_users"   class="dmtDocumentStructureWrapper">
			 
		 </div><br>
		 <div id="available_users_add" style="display: inline">
			<input id="add-user-group-button" type="button" value="Add" class="button button-primary">
		 </div>
		</td> 
            	  
     </tr>
	     <tr>  
         <td width="595"  height="20"> 
		</td> 
            	  
     </tr>
	  <tr id="row-folder-visibility">  
         <td colspan="2"  >
		 <strong>Folder Visibility:</strong><br> 
		 <div id="group_folder" class="dmtDocumentStructureWrapper">
		</div><br>
		  <div id="available_group_folder" style="display: inline">
			<input id="add-group-folder-button" type="button" value="Add" class="button button-primary">
		 </div>
		</td> 
            	  
     </tr>
	     <tr>  
         <td width="595"  height="20">  
		</td> 
            	  
     </tr>
	
    </table>  
	</form>
	<div id="processing-img" style="display:none"><img src="<?php echo WP_PLUGIN_URL. '/aj-file-manager-system/img/loading.gif';?>"></div> 