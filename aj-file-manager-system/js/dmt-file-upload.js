function dmt_fetch_uploaded_file_ajax(post_id,post_url)
{
	
	jQuery.post(
	post_url,
	{'dmt_latest_file':post_id},
	function(data){
		
	//console.log(data);
		jQuery('p#dmt_upload_media_para').slideToggle(250);
		jQuery('div#titlewrap input:text').val(data.file_name);
		var admin_url = jQuery('#dmt_files_admin_url').val();
		var dmt_table_row_html = '<tr id="dmt_file_table_row">';
			dmt_table_row_html += '<td height="30">'+ data.file_name +'</td>';
			dmt_table_row_html += '<td height="30">'+ data.file_type +'</td>';
			dmt_table_row_html += '<td height="30"><input type="button" id="dmt_attachment_'+ data.file_id +'" name="upload_media_button_name" class="button-secondary" value="Delete File" onClick="dmt_delete_file(\''+ post_id +'\',\''+ data.file_id  +'\',\''+ admin_url +'\')"/></td>';
			dmt_table_row_html += '</tr>';
				
	if(jQuery('#dmt_file_uploads_table').length > 0)
	{
		jQuery('#dmt_file_uploads_table').find('#dmt_file_table_row').first().before(dmt_table_row_html);
	}
	else
	{
			var dmt_table_html = '<table class="widefat dmtFileRow" id="dmt_file_uploads_table"><thead><tr><th>File Name</th><th>Type</th><th>Delete</th></tr></thead><tbody>';
			dmt_table_html += dmt_table_row_html;
			dmt_table_html += '</tbody></table>';
			dmt_table_html += '<div class="dmtDeletingFile" style="display:none;"><span class="dmtDeletingFileGif">&nbsp;</span><span class="dmtFileDeletedText">Deleting File</span></div><input type="hidden" id="dmt_ajax_hidden_url" name="dmt_ajax_hidden_url" value="'+ post_url +'" />';
			
			jQuery('#dmt_upload_media_para').after(dmt_table_html);
	}
		
		},
	'json'
	);
	//console.log(post_id,post_url);
}

//registers our callback with plupload on media-upload.php
function dmtBindPostDocumentUploadCB(post_id,ajax_url) {
	
if ( typeof uploader == 'undefined' )
{		
		return;
}

uploader.bind( 'FileUploaded', function( up, file, response ) {
					
		//if error, kick
		if ( response.response.match('media-upload-error') )
			return;
						
		dmtPostDocumentUpload( file.name, response.response, post_id, ajax_url );
	});
    

}

//callback to handle post document upload event
function dmtPostDocumentUpload( file, attachmentID, post_id,ajax_url ) {

    	//3.3+ verify the uploaded was successful
	if ( typeof( attachmentID ) == 'string' && attachmentID.indexOf( 'error' ) != -1 ) {
		jQuery('.media-item:first').html( attachmentID );
		return;
	}
		
    //Because we're in an iFrame, we need to traverse to parrent
    var win = window.dialogArguments || opener || parent || top;
       
    //kill any "document updated" messages to prevent confusion
    win.jQuery('#message').remove();
    
    //re-enabled the submit button
    win.jQuery(':button, :submit', '#submitpost').removeAttr('disabled');
    
    //flip the upload flag to enable the update button
    win.hasUpload = true;    
    
	win.tb_remove();
	
	win.dmt_fetch_uploaded_file_ajax(post_id,ajax_url);	
    
	//notify user of success by adding the post upload notice before the #post div
    //to ensure we get the user's attention, blink once (via fade in, fade out, fade in again).
	var fileUploadedMessage = '<div id="message" class="updated below-h2"><p>New File Added</p></div>';
    win.jQuery('#post').before(fileUploadedMessage).prev().fadeIn().fadeOut().fadeIn();
    				
}
function dmt_delete_file(post_id,file_id,all_files_url){
		
		jQuery('.dmtDeletingFile').slideDown('slow');
		var ajax_url   = jQuery('#dmt_ajax_hidden_url').attr('value');
		var current_element = jQuery('#dmt_attachment_'+file_id);
		
		//console.log(current_element,ajax_url);
			jQuery.post(
						ajax_url,
						{'dmt_delete_file':file_id,
						'dmt_file_post_id':post_id},
						function(data){
							if(data.deleted == 1 )
							{
								jQuery('#message').remove();
								if(jQuery('tr#dmt_file_table_row').size() == 1)
								{
								  jQuery('#dmt_file_uploads_table').remove();
								}
								else
								{
									current_element.parent().parent().remove();
								}
								var fileDeletedMessage = '<div id="message" class="updated below-h2"><p>File Deleted</p></div>';
    							jQuery('#post').before(fileDeletedMessage).prev().fadeIn().fadeOut().fadeIn();
								jQuery('.dmtFileDeletedText').html('File deleted successfully... Redirecting');
								window.location.href = all_files_url;
							}
						},'json');
		
		}
	
jQuery(document).ready(function()
{
	if(jQuery('#post_type').val() !="dmt_messages")
		{
			jQuery('#post-body-content div#titlediv').hide();
		}
	
	window.onbeforeunload = function(e) {};
}
);