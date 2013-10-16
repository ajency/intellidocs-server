

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


jQuery('.add-sub-folder').live('click', function(e) {
	jQuery("#add-folder-div").remove() 
	html = "<div style='display:inline' id='add-folder-div'><hr><table><tr><td><b>Folder Name</b>:</td><td><input type='text' id='folder-name'> <input type='hidden' id='parent-folder' value='"+jQuery("#"+e.target.id).attr("parent-folder")+"'></td></tr><tr><td><b>Description</b>:</td>  <td><textarea id='folder-desc' rows='5' cols='50'></textarea></td></tr></table><input type='button' id='create-sub-folder' value='Create' class='button button-primary'> <input type='button' id='cancel-add-folder' value='Cancel' class='button button-primary'><hr></div>"
	if (jQuery("#"+e.target.id).attr("parent-folder")==0)
	{
		jQuery("#"+e.target.id).after(html) 
	}
	else
	{
		jQuery("#"+e.target.id).parent().after(html)
	}

});
jQuery('#cancel-add-folder').live('click', function(e) {
	jQuery("#add-folder-div").remove() 
});

jQuery('#create-sub-folder').live('click', function(e) {
	
	if(jQuery("#folder-name").val()=="")
		{

		alert("Please Enter Folder Name")
		
		return false;
		}
	folder_name = jQuery("#folder-name").val()
	parent_folder = jQuery("#parent-folder").val()
	folder_desc =   jQuery("#folder-desc").val()
	jQuery("#add-folder-div").after("<div style='display:inline' id='msg-folder-div"+parent_folder+"'>Creating Sub Folder.....</div>")
	jQuery("#add-folder-div").remove() 

	var folder_data = 
	{
		action 			: 'dmt_ajax_create_sub_folder',
		folder_name 	: folder_name,
		parent_folder 	: parent_folder,
		folder_desc 	: folder_desc,
	};

	jQuery.post(ajaxurl, folder_data, function(response) {

		if(response.success == true)
		{

			jQuery("#msg-folder-div"+parent_folder+"").remove()
			alert(folder_name+" Folder Created Successfully!")
			location.reload();	
		}
		else
		{
			jQuery("#msg-folder-div"+parent_folder+"").remove()
			alert('Something seems to have gone wrong with the create sub folder. Try again later.');
		}
	});

});


