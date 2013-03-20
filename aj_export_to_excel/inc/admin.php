<?php 
function aj_xl_add_menu_page()
{
	$icon_url = plugins_url('/aj_export_to_excel/img/log_ok.png');
	add_menu_page( 'Logs', 'Logs', 'delete_users', 'aj-xl-logs', 'aj_xl_add_menu_screen', $icon_url);
}
add_action('admin_menu', 'aj_xl_add_menu_page');

function aj_xl_add_menu_screen()
{
	
	$sort_array = array('asc' => 'desc','desc' => 'asc');
	//Paginating the array
	$page 			= $_GET['pageno']; 
	$link_prefix 	= admin_url('/admin.php?page=aj-xl-logs&pageno=');
	$per_page	 	= 20;
	$file_array		= aj_xl_get_logged_files();	
	$pagination 	= pagination_array($file_array,$page, $link_prefix, false , $per_page);
	
	if(!$pagination)
		$file_data = $file_array;	
   	else 
   		$file_data = $pagination['array'];
   	
   	
   	$url = admin_url('/admin.php?page=aj-xl-logs');
   	
   	if(isset($_GET['pageno']))
   		$url .= '&pageno='.$_GET['pageno'];
   	
   	$sort_name_url = $url;
   	
   	if(isset($_GET['sfn']))
   		$sort_name_url .= '&sfn='.$sort_array[$_GET['sfn']];
   	else
   		$sort_name_url .= '&sfn=asc';
   	
   	$sort_date_url = $url;
   	
   	if(isset($_GET['sfd']))
   		$sort_date_url .= '&sfd='.$sort_array[$_GET['sfd']];
   	else
   		$sort_date_url .= '&sfd=asc';
   	
   	
	?>
	<div class="wrap">
		<div id="icon-edit-pages" class="icon32"></div>
	    <h2>Logs</h2>
	    <br>
	    <p class="description">Saved logs data.</p>
		
		<div class="tablenav">
			<div class='tablenav-pages'>
				<?php echo $pagination['panel'];  // Echo out the list of paging. ?>
			</div>
		</div>
	
		<table class="wp-list-table widefat fixed">
			<thead>
				<tr>
					<th class="sortable <?php echo (isset($_GET['sfn']))?$sort_array[$_GET['sfn']]:'asc'?>">
						<a href="<?php echo $sort_name_url;?>">
							<span><?php echo __('File Name')?></span>
							<span class="sorting-indicator"></span>
						</a>
					</th>
					<th class="sortable <?php echo (isset($_GET['sfd']))?$sort_array[$_GET['sfd']]:'asc'?>">
						<a href="<?php echo $sort_date_url;?>">
							<span><?php echo __('Date Created')?></span>
							<span class="sorting-indicator"></span>
						</a>
					</th>
					<th><?php echo __('Download Link')?></th>
				</tr>
			</thead>
			<tbody>
				<?php if(count($file_array) > 0):?>
				<?php foreach ($file_data as $data):?>
				<tr>
					<td><strong><?php echo $data['file_name']; ?></strong></td>
					<td><?php echo $data['file_modified']; ?></td>
					<td><a href="<?php echo $data['file_url']; ?>" title="Download <?php echo $data['file_name']?>">Download</a></td>
				</tr>
				<?php endforeach;?>
				<?php else:?>
				<tr>
					<td>No Files Found!</td>
				<tr>
				<?php endif;?>
			</tbody>
		</table>
	
		<div class="tablenav">
			<div class='tablenav-pages'>
				<?php echo $pagination['panel'];  // Echo out the list of paging. ?>
			</div>
		</div>
	</div>
	<?php 
}

function aj_xl_get_logged_files()
{
	$upload_dir = wp_upload_dir();
	$upload_url	= $upload_dir['baseurl'].'/logs';
	
	$upload_dir	= $upload_dir['basedir'].'/logs';
	
	$file_array	= array();
	
	if(is_dir($upload_dir))
	{	
	
	if ($handle = opendir($upload_dir)) {
		while (false !== ($file = readdir($handle)))
		{
			if ($file != "." && $file != "..")
			{
				$file_array[] = array(
										'file_name' 		=> $file , 
										'file_modified' 	=> date ("F d Y",filemtime($upload_dir.'/'.$file)),
										'file_url'			=> $upload_url.'/'.$file,
										'file_timestamp'	=> filemtime($upload_dir.'/'.$file),
									);			 
			}
		}
		closedir($handle);
	}
	
	
	foreach ($file_array as $key => $row) {
		$file_name[$key]  		= $row['file_name'];
		$file_timestamp[$key] 	= $row['file_timestamp'];
	}
	
	$multisort_options = array('asc' => SORT_ASC,'desc' => SORT_DESC);
	
	if(isset($_GET['sfn']))
	{
		array_multisort($file_name, $multisort_options[$_GET['sfn']], $file_timestamp, SORT_ASC, $file_array);
		return $file_array;
	}
	
	if(isset($_GET['sfd']))
	{
		array_multisort($file_name, SORT_ASC, $file_timestamp, $multisort_options[$_GET['sfd']], $file_array);
		return $file_array;
	}
	
	array_multisort($file_name, SORT_DESC, $file_timestamp, SORT_DESC, $file_array);
	}	
	return $file_array;
}