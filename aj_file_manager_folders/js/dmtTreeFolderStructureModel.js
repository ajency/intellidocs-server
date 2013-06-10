 
 
	  function funconfirmaction(rel,folder_name,folder_id){ 
		  
		   folder = jQuery(this).attr("folder-name")
			ret = confirm("Are you sure you want to delete the folder "+folder_name+" ?")
			if(ret==true)
			{  
				 
				
				var folder_data = 
				{
						action 			: 'dmt_ajax_folder_delete',
						recursive 			: 'no',
						folder_id 		: folder_id 
				};
	 
				jQuery.post(ajaxurl, folder_data, function(response) {
	
					if(response.success == true)
					{
						alert(folder_name+" Folder Deleted Successfully!")
						location.reload();	
					}
					else
					{
						 
						alert('Something seems to have gone wrong with the delete. Try again later.');
					}
				});
		} 
	  }	

 