jQuery(document).ready(function(){
	jQuery('#message').hide();
	jQuery('#available_users_add').hide();
	jQuery('#add-group-folder-button').hide();
	jQuery('#row-group-members').hide();
	jQuery('#row-folder-visibility').hide();
	jQuery('#update-group-name').hide();
	jQuery('#groups').bind('change', function() { 
		jQuery('#row-group-members').hide();
		jQuery('#row-folder-visibility').hide();
		if(jQuery(this).val()!="")
			{  
				jQuery('#row-default').html("<br><br>"+jQuery('#processing-img').html()+" Processing");
				jQuery('#update-group-name').show();
				fetch_available_users();
				fetch_group_folders();
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
					});
		  
	});
		jQuery('.add-user-group-button').live('click',function(){
	 
		var _ids = []; 
	 	button_content = jQuery('.available_users_add').html();
		jQuery('.available_users_add').html(jQuery('#processing-img').html());
		 jQuery('.available_user').each(function(){  
			 if(jQuery(this).is(':checked'))
			 {
				 _ids.push(jQuery(this).val());
			}
		 }); 
		 jQuery.post(ajaxurl,{
						action : 'add_users_to_group',
						group_id :  jQuery('#groups').val(),
						user_ids : _ids
					  },
						function(response){  
						 jQuery('#message').html(response);
						 jQuery('#message').show();
						 jQuery('.available_users_add').html(button_content);

						 jQuery('#groups').trigger("change")
					});
		  
	});
	
	 function fetch_available_users()
	 {  
		jQuery.post(ajaxurl,{
						action : 'get_available_users' , 
						group_id : jQuery('#groups').val() ,
						call_by :'ajax'
					  },
						function(response){   
							if(response !="")
							{
							
								jQuery('#available_users_add').show();
								jQuery('#row-group-members').show();
								jQuery('#row-default').html("")
							}
						  jQuery('#available_users').html(response);
					});
	 }
	 
	  function fetch_group_folders()
	 {  
		jQuery.post(ajaxurl,{
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
		 
});


