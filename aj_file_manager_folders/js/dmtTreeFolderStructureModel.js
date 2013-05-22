 

jQuery(document).ready(function(){ 
	 jQuery('.delete-folder').click(function(){

		    folder = jQuery(this).attr("folder-name")
			ret = confirm("Are you sure you want to delete the folder "+folder+" ?")
			if(ret==true)
			{  
				window.open( jQuery(this).attr("rel"), '_blank');
				}
		});


});