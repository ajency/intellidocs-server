jQuery(document).ready(function() {
	jQuery('#ppUploader').hide();
	//On hover of the reset settings button.	
	jQuery('#ppResetSettings').hover(
		function(){
					jQuery(this).addClass('ppResetSettingsHover');
					jQuery('.ppIconReset').addClass('ppIconResetWhite');
					},
		function(){
					jQuery(this).removeClass('ppResetSettingsHover');
					jQuery('.ppIconReset').removeClass('ppIconResetWhite');
					}
			);
	//On Click of the reset setttings button.
	jQuery('#ppResetSettings').click(function(){
		
		jQuery('#ppUploader').hide();
		pp_enable_folders_selected();
		jQuery('#html5_pp_add_folder').show();
		jQuery(this).addClass('ppResetHide');
		jQuery('#ppResetQueue').addClass('ppResetHide');
		
		});	
	//On reset queue hover 
	jQuery('#ppResetQueue').hover(
	function(){
		jQuery(this).addClass('ppResetSettingsHover');
		jQuery('.ppIconQueueReset').addClass('ppIconResetWhite');
		},
	function(){
		jQuery(this).removeClass('ppResetSettingsHover');
		jQuery('.ppIconQueueReset').removeClass('ppIconResetWhite');
		}
	);	
	//On click on the reset queue button
	jQuery('#ppResetQueue').click(function(){
		
		jQuery('#html5_uploader').pluploadQueue().splice();
		jQuery('.plupload_buttons').show();
		jQuery('.plupload_upload_status').hide();
		});			
});
//Function to get the values of the folders selcted.
function pp_get_folders_selected() {   
 	     
     var allVals = [];
	 jQuery('.folder-root').each(function()
	 {
		 
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			if(jQuery(this).is(':checked'))
			{ 
				 allVals.push(jQuery(this).val());
				 console.log(jQuery(this).val());
			}
		});
	 
	 });
 	console.log(allVals);
	return allVals;
  }	
//Function to disable all the checkboxes. 
function pp_disable_folders_selected() {   
 	     
	 jQuery('.folder-root').each(function()
	 {
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			jQuery(this).attr('disabled',true);
		}); 
	 });
  }	
//Function to enable all the checkboxes. 
function pp_enable_folders_selected() {   
	     
	 jQuery('.folder-root').each(function()
	 {
		jQuery(this).find('input[type=checkbox]').each(function()
		{  
			jQuery(this).removeAttr('disabled');
			jQuery(this).removeAttr('checked');
		}); 
	 });
  }	
  
//Function to set the padding right for the nested categories.  
jQuery(function(){
		jQuery('[id$="-all"] > ul.categorychecklist').each(function() {
			var $list = jQuery(this);
			var $firstChecked = $list.find(':checked').first();

			if ( !$firstChecked.length )
				return;

			var pos_first = $list.find(':checkbox').position().top;
			var pos_checked = $firstChecked.position().top;

			$list.closest('.tabs-panel').scrollTop(pos_checked - pos_first + 5);
		});
	});   