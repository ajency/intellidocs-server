<?php 
$path = $_SERVER['DOCUMENT_ROOT'];

$mypath = '';
$path = $path.$mypath;

//include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';

$folder_id 	=	$_GET['ID'];
$taxonomy 	=  	$_GET['taxonomy'];

$folder 	= get_term($folder_id, $taxonomy);

$download_file_name = sanitize_file_name($folder->name).'_'.date("d_m_Y").'.xls';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php 

		header("Content-type: application/x-msdownload"); 
		# replace excelfile.xls with whatever you want the filename to default to
		header("Content-Disposition: attachment; filename=$download_file_name");
		header("Pragma: no-cache");
		header("Expires: 0");
?>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
<title>Category Download</title>
</head>
<body>
<?
	$table  = '';
	$table .= aj_xl_display_table_head($folder->term_id);
	$table .= aj_xl_display_table_content($folder->term_id);
	echo $table;
	aj_xl_save_to_file_system($folder_id,$taxonomy,$download_file_name);

?>
</body>
</html>