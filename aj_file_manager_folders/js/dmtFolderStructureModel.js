jQuery(document).ready(function(){
	jQuery('form.search-form').remove();
	//jQuery('div#col-right').find('div.col-wrap').remove();
	var folder_structure = jQuery('#dmtFolderStructreWrapper');
	//jQuery('div#col-right').append('<h2>Folder Structure</h2>');
	//jQuery('div#col-right').append('<span class="description">Click on the folder name to see the details. Click on the \'+\' or \'-\' to expand or collapse respectively.</span>');
	//jQuery('div#col-right').append(folder_structure);
});

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