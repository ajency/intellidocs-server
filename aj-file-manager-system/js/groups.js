jQuery(document).ready(function(){
	//


  
	   jQuery('.ppFolderStructureUlwrapper-document-folder li > ul').each(function(i) {
 
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
	//
	   jQuery('.ppFolderStructureUlwrapper-document-folder ul ul').hide();

	   if('.ppFolderStructureUlwrapper-document-folder'.length!=0){

jQuery('#document-folder-parent-'+jQuery("#dmt_folder_term_id").val()).parent("li").remove();
	    jQuery('#document-folder-parent-'+jQuery("#dmt_folder_parent_id").val()).attr("checked","checked");
	   
	    jQuery('#document-folder-parent-'+jQuery("#dmt_folder_parent_id").val()).parents('ul').each(function()
	    {
	    	jQuery(this).css("display","block");
	    })
	}

	   
	jQuery('#message').hide();
	jQuery('#available_users_add').hide();
	jQuery('#add-group-folder-button').hide();
	jQuery('#row-group-members').hide();
	jQuery('#row-division-members').hide();
	jQuery('#row-folder-visibility').hide();
	jQuery('#update-group-name').hide();
	jQuery('#groups').bind('change', function() { 
	
		jQuery('.add-group-folder-button').show();

		jQuery('.save-group-folder-button').hide();

		jQuery('.add-user-group-button').show();

		jQuery('.save-user-group-button').hide();
		jQuery('#row-group-members').hide();
		jQuery('#row-folder-visibility').hide();
		if(jQuery(this).val()!="")
			{  
				jQuery('#row-default').html("<br><br>"+jQuery('#processing-img').html()+" Processing");
				jQuery('#update-group-name').show();
				fetch_available_users('group change');
				fetch_group_folders('group change');
				jQuery('#group_name_update').val(jQuery('#groups option:selected').text());
				 
			} 
		
    });

	jQuery('#add-group-button').live('click',function(){
	 var group_name = jQuery('#group_name').val();
		 if (group_name == "")
		 {
			 alert("Please Enter Group Name!")
			 jQuery('#group_name').focus();
			 return false;
		} 
		else
		{
			
			button_content = jQuery('#add-group-name').html();
			jQuery('#add-group-name').html(jQuery('#processing-img').html());
			jQuery.post(ajaxurl,{
								action : 'add_groups',
								group_name :  jQuery('#group_name').val()
							  },
								function(response){  
								 fetch_groups();
								 jQuery('#add-group-name').html(button_content);
								 jQuery('#message').html(response);
								 jQuery('#message').show();
							});
		}
	});
	
	jQuery('#remove-group-button').live('click',function(){
		reply = confirm("Are You Sure You Want To Delete This Group?")
		if (reply==true)
		{
			button_content = jQuery('#update-group-name').html();
			jQuery('#update-group-name').html(jQuery('#processing-img').html());
			jQuery.post(ajaxurl,{
								action : 'delete_group',
								group_id : jQuery('#groups').val() 
									  },
								function(response){   
									jQuery('#update-group-name').hide();
									jQuery('#update-group-name').html(button_content);					 
									fetch_groups();
									jQuery('#message').html(response);
									jQuery('#message').show(); 
									});
	}
		 
	});
	
	jQuery('#update-group-button').live('click',function(){
	
	 var group_name = jQuery('#group_name_update').val();
		 if (group_name == "")
		 {
			 alert("Please Enter Group Name!")
			 jQuery('#group_name_update').focus();
			 return false;
		} 
		else
		{ 
			button_content = jQuery('#update-group-name').html();
			jQuery('#update-group-name').html(jQuery('#processing-img').html());
			jQuery.post(ajaxurl,{
						action : 'update_group_name',
						group_id : jQuery('#groups').val(),
						group_name :  group_name
					  },
						function(response){   
						 fetch_groups();
						 jQuery('#message').html(response);
						 jQuery('#message').show(); 
						 jQuery('#update-group-name').html(button_content);
					});
		}
	});
	
		jQuery('.add-group-folder-button').live('click',function(){
		fetch_group_folders('add group folders');
		
	});
	jQuery('.save-group-folder-button').live('click',function(){
	 
		var _ids = [];
		button_content = jQuery('.available_group_folder').html();
		jQuery('.available_group_folder').html(jQuery('#processing-img').html());
		 jQuery('.folder_list').each(function(){  
			 if(jQuery(this).is(':checked'))
			 {
				 _ids.push(jQuery(this).val());
			}
		 });
		 jQuery.post(ajaxurl,{
						action : 'add_folders_to_group',
						group_id :  jQuery('#groups').val(),
						folder_ids : _ids
					  },
						function(response){  
						 jQuery('#message').html(response);
						 jQuery('#message').show();
						 jQuery('.available_group_folder').html(button_content);
						 jQuery('#groups').trigger("change")
						  jQuery('.add-group-folder-button').show();

						 jQuery('.save-group-folder-button').hide();
					});
		  
	});

	jQuery('.add-user-group-button').live('click',function(){
		fetch_available_users('add group members');
	
		
	});
	jQuery('#add-user-division-button').live('click',function(){
		
		fetch_dmt_users('add group members');
		
	});
		jQuery('.save-user-group-button').live('click',function(){
	 
		var _ids = []; 
	 	button_content = jQuery('.available_users_add').html();
		jQuery('.available_users_add').html(jQuery('#processing-img').html());
		 jQuery('.available_user').each(function(){  
			 if(jQuery(this).is(':checked'))
			 {
				 _ids.push(jQuery(this).val());
			}
		 });
		 var action;
		 var groupid;
var group = document.getElementById('groups');
var division = document.getElementById('division');
	if(group!=null)
{
action = 'add_users_to_group';
groupid  = jQuery('#groups').val();
}
if(division!=null)
{
action = 'add_division_to_memebers';
groupid  = jQuery('#division').val();
}	
		
		 jQuery.post(ajaxurl,{
						action : action,
						group_id :  groupid,
						user_ids : _ids
					  },
						function(response){  
						 jQuery('#message').html(response);
						 jQuery('#message').show();
						 jQuery('.available_users_add').html(button_content);
	if(group!=null)
{
						 jQuery('#groups').trigger("change");
						 }
						 if(division!=null)
{
 jQuery('#division').trigger("change");
}
						 jQuery('.add-user-group-button').show();

						 jQuery('.save-user-group-button').hide();

					});
		  
	});
	
	 function fetch_available_users(event)
	 {  
		jQuery.post(ajaxurl,{
						action : 'get_available_users' , 
						event : event , 
						group_id : jQuery('#groups').val() ,
						call_by :'ajax',

					  },
						function(response){   
							if(response !="")
							{
							
								jQuery('#available_users_add').show();
								jQuery('#row-group-members').show();
								jQuery('#row-default').html("")

								if(event=="add group members"){
									jQuery('.add-user-group-button').hide();

									jQuery('.save-user-group-button').show();
								}
							}
						  jQuery('#available_users').html(response);
					});
	 }
	 
	  function fetch_group_folders(event)
	 {  
		jQuery.post(ajaxurl,{
			event:event,
						action : 'get_all_folders' , 
						group_id : jQuery('#groups').val() ,
						call_by :'ajax'
					  },
						function(response){  	
						if(response !="")
							{
							
								jQuery('#add-group-folder-button').show();
								jQuery('#row-folder-visibility').show();
								jQuery('#row-default').html("")

								if(event=="add group folders"){

									  jQuery('.add-group-folder-button').hide();

						 jQuery('.save-group-folder-button').show();
								}
							} 
							
						  jQuery('#group_folder').html(response);
					});
	 }
	 
	 
	function fetch_groups()
	 {  
		jQuery.post(ajaxurl,{
						action : 'get_group_select_box' ,  
						call_by :'ajax'
					  },
						function(response){  	
							jQuery('#update-group-name').hide();
							jQuery('#groups').html(response);
							jQuery('#groups').trigger('change');
					});
	 }
		
	jQuery('#update-user-password').live('click',function(){
	 var user_pass1 = jQuery('#user_pass1').val();
	 var user_pass2 = jQuery('#user_pass2').val();
	 
		 if (user_pass1 == "")
		 {
			 alert("Please Your Password!")
			 jQuery('#user_pass1').focus();
			 return false;
		}
		if (user_pass1 != user_pass2)
		 {
			 alert("Passwords Do Not Match!")
			 jQuery('#user_pass2').focus();
			 return false;
		}
		button_content = jQuery('#btn-change-password').html(); 
		jQuery('#btn-change-password').html(jQuery('#processing-img').html());
		jQuery.post(ajaxurl,{
						action : 'dmt_change_password',
						user_pass1 :  jQuery('#user_pass1').val() 
					  },
						function(response){  
						 jQuery('#message').html(response);
						 jQuery('#message').show(); 
						 jQuery('#btn-change-password').html(""); 
						 setTimeout(window.location = jQuery('#page-redirect').val(), 5000);
					});
	});	
	
	
	///add docuemnt folder
	
	
	jQuery('#add-document-folder').live('click',function(){
	 
		 var tag_name = jQuery('#tag-name').val();
		 var parent = jQuery('input[name=parent]:checked' ).val();
		
		 if(parent == undefined)
		 {
			parent = 0;
		 }
		
		 var tag_description = jQuery('#tag-description').val(); 
 
			 if (tag_name == "")
			 {
				 alert("Please Document Folder Name!")
				 jQuery('#tag-name').focus();
				 return false;
			} 
			 jQuery('#message').html('');
			 jQuery('#message').hide(); 
			 button_content = jQuery('.available_document-folder').html();
			jQuery('.available_document-folder').html(jQuery('#processing-img').html());
			 jQuery.post(ajaxurl,{
							action : 'dmt_add_folder',
							tag_name :  tag_name, 
							parent :  parent, 
							tag_description :  tag_description
						  },
							function(response){ 
							 if(response.error_msg!="")
								 {

								 jQuery('#message').html(response.error_msg);
								 jQuery('#message').show(); 
								 jQuery('.available_document-folder').html(button_content);
								 }
							 else
								 {
								 jQuery('#parent').html(response.parent);
								 jQuery('#tag-name').val('');
								 jQuery('#tag-name').val('');
								 jQuery('#message').html(response.msg);
								 jQuery('#message').show();   
								 jQuery('.available_document-folder').html(button_content);
								 
								 }
						location.href = document.getElementById('tag-link').value;
						});  
		});	
//scripts added by surekha////
		jQuery('#division').bind('change', function() { 
	
		//jQuery('.add-group-folder-button').show();

		//jQuery('.save-group-folder-button').hide();

		//jQuery('.add-user-division-button').show();

		jQuery('.save-user-group-button').hide();
		jQuery('#row-division-members').hide();
		//jQuery('#row-folder-visibility').hide();
	
		if(jQuery(this).val()!="")
			{  
				jQuery('#row-default_div').html("<br><br>"+jQuery('#processing-img').html()+" Processing");
			
				fetch_dmt_users('group change');
				//fetch_group_folders('group change');
				//jQuery('#group_name_update').val(jQuery('#groups option:selected').text());
				 
			} 
		
    });
	
 function fetch_dmt_users(event)
	 {  
	
		jQuery.post(ajaxurl,{
						action : 'get_dmt_users' , 
						event : event , 
						group_id : jQuery('#division').val() ,
						call_by :'ajax',

					  },
						function(response){   
							if(response !="")
							{
							
								jQuery('#available_division_add').show();
								jQuery('#row-division-members').show();
								jQuery('#row-default_div').html("")

								if(event=="add group members"){
									jQuery('.add-user-group-button').hide();

									jQuery('.save-user-group-button').show();
								}
							}
						  jQuery('#available_division').html(response);
					});
	 }

	jQuery('.move').live('click' ,function(e){ 
		jQuery('#loading').show()
		window.current_folder = jQuery(e.target).attr('data-termid'); 
		jQuery.post(ajaxurl,{
						action : 'get_categories' , 
						call_by :'ajax',

					  },
						function(response){  
							if(response !="")
							{
								jQuery('#loading').hide()
								jQuery('.show_cat').html(response);
								// jQuery('.show_cat').removeClass('hidden')

								jQuery('#myModal').modal()
							}
						  
					});

	 })
	window.CATEGORIES = [];
	jQuery('.folders_check').live('click' ,function(e){ 
		if(jQuery(e.currentTarget).is(':checked'))
			window.CATEGORIES.push(parseInt(jQuery(e.target).attr('data-catid')))
		else{
			index = window.CATEGORIES.indexOf(parseInt(jQuery(e.target).attr('data-catid')))
			window.CATEGORIES.splice(index, 1);
		}

	 })

	jQuery('.save').live('click' ,function(e){ 
		folder_name = window.current_folder; 
		parent_folder = window.CATEGORIES.join(',');
		if(window.CATEGORIES.length == 0){
			alert('Select atleast one folder');
			return false;
		}
		var folder_data = 
			{
				action 			: 'save_move_folders',
				folder_name 	: folder_name,
				parent_folder 	: parent_folder,
				call_by :'ajax',
			}
		jQuery.post(ajaxurl,folder_data,
						function(response){  
							window.CATEGORIES = [];
							if(response !="")
							{
								jQuery('#myModal').modal('hide');
							}
						  
					});

	 })

	jQuery('.delete_items').live('click' ,function(e){ 
		jQuery('#loading').show()
		window.parentFolder = jQuery(e.target).attr('data-termid'); 
		var folder_data = 
			{
				action 			: 'get_child_categories',
				parent_folder 	: parentFolder,
				call_by :'ajax',
			}
		jQuery.post(ajaxurl,folder_data,
						function(response){  
							if(response !="")
							{
								jQuery('#loading').hide()
								jQuery('.show_child').html(response);
								// jQuery('.show_cat').removeClass('hidden')

								jQuery('#myDeleteModal').modal()
							}
						  
					});

	 })
	window.DELETECATEGORIES = []
	jQuery('.folders_del_check').live('click' ,function(e){ 
		if(jQuery(e.currentTarget).is(':checked'))
			window.DELETECATEGORIES.push(parseInt(jQuery(e.target).attr('data-catid')))
		else{
			index = window.DELETECATEGORIES.indexOf(parseInt(jQuery(e.target).attr('data-catid')))
			window.DELETECATEGORIES.splice(index, 1);
		}

	 })
	jQuery('.deleteFolder').live('click' ,function(e){ 
		parent_folder = window.DELETECATEGORIES.join(',');
		if(window.DELETECATEGORIES.length == 0){
			alert('Select atleast one folder');
			return false;
		}
		var folder_data = 
			{
				action 			: 'delete_child_categories',
				parent_folder 	: parent_folder,
				call_by :'ajax',
			}
		jQuery.post(ajaxurl,folder_data,
						function(response){ 
							window.DELETECATEGORIES = []; 
							if(response !="")
							{
								jQuery('#myDeleteModal').modal('hide');
								window.location.reload()
							}
						  
					});

	 })

	jQuery('.selectall').live('click' ,function(e){ 
		if(jQuery(e.currentTarget).is(':checked')){
			jQuery('.folders_del_check').each(function(index,item){
					window.DELETECATEGORIES.push(parseInt(jQuery(item).attr('data-catid')))
					jQuery(item).prop('checked',true);

			})
		}
		else{
			jQuery('.folders_del_check').each(function(index,item){
					index = window.DELETECATEGORIES.indexOf(parseInt(jQuery(item).attr('data-catid')))
					window.DELETECATEGORIES.splice(index, 1);
					jQuery(item).prop('checked',false);

			})
			
		}

	 })
	
	jQuery('.doc_folders').live('click' ,function(e){ 
		if(jQuery(e.currentTarget).is(':checked')){
			window.FOLDERS.push(jQuery(e.currentTarget).val())
		}
		else{
			index = window.FOLDERS.indexOf(jQuery(e.currentTarget).val())
			window.FOLDERS.splice(index, 1);
			
		}

	 })

	jQuery("div.accordion").accordion({
    // autoHeight: false,
    collapsible: true,
    active: false,
    heightStyle: "content"


});

//scripts added by surekha////	 
});

window.onload = function() {

if(localStorage.getItem('selected_folder')!="")
{
	jQuery("#division option:contains(" + localStorage.getItem('selected_folder') + ")").attr('selected', 'selected');
jQuery('#division').trigger("change");
localStorage.setItem('selected_folder',"");

}
			
			



}


