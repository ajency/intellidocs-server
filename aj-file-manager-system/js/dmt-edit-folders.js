// JavaScript Document

jQuery(document).ready(function(){
	
	current_folder = jQuery('#dmt_folder_term_id').val();
	//jQuery('#document_folders-'+current_folder).remove();
	var dmtPublishButton;
	
	jQuery('.dmtOptionSelect').click(function(){
		
		var _this = jQuery(this);
		if(jQuery(this).hasClass('selected'))
			return false;
		
		button_status = jQuery(this).html();
			
		if(button_status == 'Publish')
		{
			jQuery('#dmt_folder_status').val('published');
			dmtPublishButton = _this;
			jQuery('#dmtPublishSendEmail').trigger('click');
		}
		else
		{
			jQuery(this).next('.dmtOptionSelect').removeClass('selected');
			jQuery(this).prev('.dmtOptionSelect').removeClass('selected');
			jQuery(this).addClass('selected');
			jQuery('#dmt_folder_publish_spinner').show();
			
			jQuery('#dmt_folder_status').val('unpublished');	

			var data = 
			{
					action 		: 'dmt_ajax_folder_status_update',
					folder_id 	: jQuery('#dmt_folder_term_id').val(),
					status 	  	: jQuery('#dmt_folder_status').val(),
			};

			jQuery.post(ajaxurl, data, function(response) {

				if(response.success == true)
				{
					jQuery('#dmt_folder_publish_spinner').hide();
					if(response.status == 'published')
						jQuery('#dmtFolderDeactivateButton').html('Deactivate Folder');
				}
				else
				{
					alert('Something seems to have gone wrong with the update. Try again later.');
					jQuery('#dmt_folder_publish_spinner').hide();
					_this.next('.dmtOptionSelect').addClass('selected');
					_this.prev('.dmtOptionSelect').addClass('selected');
					_this.removeClass('selected');
				}	
			});
		}
		
		});
	
	//Pop up publish folder settings.
	jQuery('#dmtPublishSettingsPublish').live('click',function(e){
		
		e.preventDefault();
		
		dmtPublishButton.next('.dmtOptionSelect').removeClass('selected');
		dmtPublishButton.prev('.dmtOptionSelect').removeClass('selected');
		dmtPublishButton.addClass('selected');
		
		jQuery('#dmt_folder_publish_spinner').show();
		
		var send_mail = (jQuery("#dmtSendEmailsYes").is(':checked'))?'yes':'no';
		
		var data = 
		{
				action 		: 'dmt_ajax_folder_status_update',
				folder_id 	: jQuery('#dmt_folder_term_id').val(),
				status 	  	: jQuery('#dmt_folder_status').val(),
				'send_mail'	: send_mail,
		};

		//console.log(data);
		jQuery.post(ajaxurl, data, function(response) {

			if(response.success == true)
			{
				//console.log(response);
				jQuery('#dmt_folder_publish_spinner').hide();
				if(response.status == 'published')
					jQuery('#dmtFolderDeactivateButton').html('Deactivate Folder');
			}
			else
			{
				alert('Something seems to have gone wrong with the update. Try again later.');
				jQuery('#dmt_folder_publish_spinner').hide();
				dmtPublishButton.next('.dmtOptionSelect').addClass('selected');
				dmtPublishButton.prev('.dmtOptionSelect').addClass('selected');
				dmtPublishButton.removeClass('selected');
			}	
		});
		
		tb_remove();
	});
	
		
		jQuery('.dmtFolderOptionSelect').click(function(){
				
				jQuery(this).next('.dmtFolderOptionSelect').removeClass('selected');
				jQuery(this).prev('.dmtFolderOptionSelect').removeClass('selected');
				
				if(jQuery(this).hasClass('selected'))
					jQuery(this).removeClass('selected');
				else
					jQuery(this).addClass('selected');
				
				if(jQuery(this).html() == 'Copy')
				{
					jQuery('#dmtFolderDeactivate').hide();
					jQuery('#dmtFolderCopy').slideToggle(250);
				}
				else if(jQuery(this).html() == 'Activate/Deactivate')
				{
					jQuery('#dmtFolderCopy').hide();
					jQuery('#dmtFolderDeactivate').slideToggle(250);
				}
			});
			
		jQuery('#dmtFolderCopyButton').click(function(){				
				var selected_folders = dmt_get_folders_selected()	;
				if(selected_folders.length == 0)
				{
					alert('Please select a destination folder(s).');
					return false;
				}

				dmt_disable_folders_selected();
				jQuery('#dmt_folder_copy_spinner').show();
				var folder_data = 
				{
					action 			: 'dmt_ajax_folder_copy',
					folder_id 		: jQuery('#dmt_folder_term_id').val(),
					copy_folders 	: selected_folders,
				};
				jQuery.post(ajaxurl, folder_data, function(response) {

					if(response.success == true)
					{
						jQuery('#dmt_folder_copy_spinner').hide();
						dmt_enable_folders_selected();
					}
					else
						{
							alert('Something seems to have gone wrong with the copy. Try again later.');
							jQuery('#dmt_folder_copy_spinner').hide();
							dmt_enable_folders_selected();
						}	
					});
				
			});
		jQuery('#dmtFolderDeactivateButton').click(function(){
					
					var _this = jQuery(this);
					var action_type = (jQuery(this).html() == 'Activate Folder')?'activate':'deactivate';
					
					var folder_data = 
					{
						action 			: 'dmt_ajax_folder_deactivate',
						folder_id 		: jQuery('#dmt_folder_term_id').val(),
						folder_action	: action_type
					};
					jQuery('#dmt_folder_deactivate_spinner').show();
					jQuery.post(ajaxurl, folder_data, function(response) {
						if(response.success == true)
							{
								jQuery('#dmt_folder_deactivate_spinner').hide();
								if(action_type == 'activate' )
									_this.html('Activate Folder');
								else
									_this.html('Deactivate Folder');
								
								window.location.reload();		
							}
						else
						{
							jQuery('#dmt_folder_deactivate_spinner').hide();
							alert('Something seems to have gone wrong with the copy. Try again later.');
						}
					});
			});		
	});
	
//Function to get the values of the folders selcted.
function dmt_get_folders_selected() {   
 	     
     var allVals = [];
	 jQuery('label.selectit').each(function()
	 {
		 
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			if(jQuery(this).is(':checked'))
			{
				 allVals.push(jQuery(this).val());
			}
		});
	 
	 });
	return allVals;
  }	
//Function to disable all the checkboxes. 
function dmt_disable_folders_selected() {   
 	     
	 jQuery('label.selectit').each(function()
	 {
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			jQuery(this).attr('disabled',true);
		}); 
	 });
  }	
//Function to enable all the checkboxes. 
function dmt_enable_folders_selected() {   
	     
	 jQuery('label.selectit').each(function()
	 {
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			jQuery(this).removeAttr('disabled');
			jQuery(this).removeAttr('checked');
		}); 
	 });
  }	
  	