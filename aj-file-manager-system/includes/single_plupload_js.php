<script type="text/javascript" src="<?php echo  plugins_url('aj-file-manager-system/js/plupload.full.js');?>"></script>
<script type="text/javascript">
<?php global $post;?>
// Custom example logic

jQuery(document).ready(function() {
	
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash',
		browse_button : 'pickfiles',
		max_file_count: 1,
        multi_selection:false,
		container : 'container',
		max_file_size : '10mb',
		multipart_params:{
			post_id:'<?php echo $post->ID;?>',
			folders : window.FOLDERS
			},
		url : '<?php echo  plugins_url('aj-file-manager-system/includes/upload_single_file.php');?>',
		flash_swf_url : '<?php echo  plugins_url('aj-file-manager-system/js/plupload.flash.swf');?>',
	});

	jQuery('#uploadfiles').click(function(e) {
		
		if(jQuery.find('.dmt_single_uploaded_file').length > 0)
		{
			// var folders_selected = plupload_get_folders_selected();
			var folders_selected = window.FOLDERS;
			console.log(folders_selected)
			
			if(folders_selected.length > 0)
			{
				jQuery('.dmt-ajax-loading-file').show();
				uploader.start();
			}
			else
			{
				alert('Please choose a document folder to upload the file to.');
			}
		}
		else
		{
			alert('Please choose a file to upload.');
		}
		e.preventDefault();
	});

	uploader.init();
	
	<?php if(!$attachments):?>
	jQuery('#submitdiv').remove();
	<?php endif;?>
	uploader.bind('FilesAdded', function(up, files) {

		jQuery.each(files, function(i, file) {
			jQuery('#filelist').find('div').each(function(){jQuery(this).remove();});
			jQuery('#filelist').append(
				'<div id="' + file.id + '" class="dmt_single_uploaded_file">' +
				file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
			'</div>');
		});

		up.refresh(); // Reposition Flash/Silverlight
	});

	uploader.bind('UploadProgress', function(up, file) {
		jQuery('#' + file.id + " b").html(file.percent + "%");
	});

	uploader.bind('Error', function(up, err) {
		
		jQuery('#filelist').append("<div>Error: " + err.code +
			", Message: " + err.message +
			(err.file ? ", File: " + err.file.name : "") +
			"</div>"
		);

		up.refresh(); // Reposition Flash/Silverlight
	});

	uploader.bind('FileUploaded', function(up, file,info) {
		jQuery('#' + file.id + " b").html("<div class='dmt_file_upload_done'></div>");
		var response = jQuery.parseJSON(info.response);
		if(response.result == 'success')
		{
			jQuery('input#title').val(response.post_title);
			window.onbeforeunload = function(e) {};
			jQuery('#post').submit(); 
		}
		else
		{
			alert('Something seems to have gone worng with the post creation. Try again later.');
		}
	});
});
function plupload_get_folders_selected() {   
 	     
     var allVals = [];
	 jQuery('#document_folderschecklist').find('label.selectit').each(function()
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
</script>	