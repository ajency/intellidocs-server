 
 
	  function funconfirmaction(rel,folder_name){ 
		  
		   folder = jQuery(this).attr("folder-name")
			ret = confirm("Are you sure you want to delete the folder "+folder_name+" ?")
			if(ret==true)
			{  
				window.open( rel, '_blank');
				} 
		} 

 