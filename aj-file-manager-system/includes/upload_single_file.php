<?php
$path = $_SERVER['DOCUMENT_ROOT'];
//include_once $path . '/wp-config.php';
// include_once $path . '/wp-load.php';
// include_once $path . '/wp-includes/user.php';
// include_once $path . '/wp-includes/wp-db.php';
// include_once $path . '/wp-includes/pluggable.php';
// include_once $path . '/wp-includes/functions.php';

include 'http://localhost/intellidocs/wp-load.php';
include 'http://localhost/intellidocs/wp-includes/user.php';
include 'http://localhost/intellidocs/wp-includes/wp-db.php';
include 'http://localhost/intellidocs/wp-includes/pluggable.php';
include 'http://localhost/intellidocs/wp-includes/functions.php';

// HTTP headers for no cache etc
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Settings
$uploads = wp_upload_dir();
$targetDir = $uploads['basedir'];//'C:\wamp\www\wordpress\wp-content\plugins\wp_files_to_posts\uploads';

$maxFileAge = 5 * 3600; // Temp file age in seconds

// 5 minutes execution time
@set_time_limit(5 * 60);

// Uncomment this one to fake upload time
// usleep(5000);

// Get parameters
$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
$fileName = isset($_REQUEST["name"]) ? $_REQUEST["name"] : '';

/** comment to keep th code same as multiple file upload begins here
//Get original file name to be put as post title.
$original_name = $fileName;

//uniquie file name 
$fileName = wp_unique_filename( $targetDir, $fileName);

//file path 
$filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;

$file_url = $uploads['baseurl'].'/'.$fileName;

//Categories/folders the user selects 
if(!empty($_REQUEST['folders']))
	$folders = explode(',',$_REQUEST['folders']);
else
	$folders = array();
comment to keep th code same as multiple file upload ends here*/

/**  code from   multiple file upload begins here**/
//Get original file name to be put as post title.
$original_name = $fileName;

//Categories/folders the user selects
if(!empty($_REQUEST['folders']))
	$folders = explode(',',$_REQUEST['folders']);
else
	$folders = array();

// Clean the fileName for security reasons
$fileName = preg_replace('/[^\w\._]+/', '_', $fileName);

// Make sure the fileName is unique but only if chunking is disabled
if ($chunks < 2 && file_exists($targetDir . DIRECTORY_SEPARATOR . $fileName)) {
	$ext = strrpos($fileName, '.');
	$fileName_a = substr($fileName, 0, $ext);
	$fileName_b = substr($fileName, $ext);

	$count = 1;
	while (file_exists($targetDir . DIRECTORY_SEPARATOR . $fileName_a . '_' . $count . $fileName_b))
		$count++;

	$fileName = $fileName_a . '_' . $count . $fileName_b;
}

$filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;

$file_url = $uploads['baseurl'].'/'.$fileName;

/**  code from   multiple file upload ends here here**/
//The post id for the new post
$id = $_REQUEST['post_id'];

// Create target dir
if (!file_exists($targetDir))
	@mkdir($targetDir);

	

// Look for the content type header
if (isset($_SERVER["HTTP_CONTENT_TYPE"]))
	$contentType = $_SERVER["HTTP_CONTENT_TYPE"];

if (isset($_SERVER["CONTENT_TYPE"]))
	$contentType = $_SERVER["CONTENT_TYPE"];

// Handle non multipart uploads older WebKit versions didn't support multipart in HTML5
if (strpos($contentType, "multipart") !== false) {
	if (isset($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
		// Open temp file
		$out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
		if ($out) {
			// Read binary input stream and append it to temp file
			$in = fopen($_FILES['file']['tmp_name'], "rb");

			if ($in) {
				while ($buff = fread($in, 4096))
					fwrite($out, $buff);
			} else
				die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
			fclose($in);
			fclose($out);
			@unlink($_FILES['file']['tmp_name']);
		} else
			die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
	} else
		die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
} else {
	// Open temp file
	$out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
	if ($out) {
		// Read binary input stream and append it to temp file
		$in = fopen("php://input", "rb");

		if ($in) {
			while ($buff = fread($in, 4096))
				fwrite($out, $buff);
		} else
			die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');

		fclose($in);
		fclose($out);
	} else
		die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
}

// Check if file has been uploaded
if (!$chunks || $chunk == $chunks - 1) {
	// Strip the temp .part suffix off 

 rename("{$filePath}.part", $filePath);
	// Create post object
  $my_post = array(
  	 'ID'			=> $id,
     'post_content' => '',
     'post_status'	=> 'publish',
     'post_author' 	=> 1,
     'tax_input'  	=> array( 'document_folders' => $folders ),
	 'post_type' 	=> 'document_files',
  );

// Insert the post into the database
  $post_id = wp_insert_post( $my_post );
  
  $wp_filetype = wp_check_filetype(basename($fileName), null );

  $attachment = array(
     'guid' 			=> $file_url, 
     'post_mime_type' 	=> $wp_filetype['type'],
     'post_title' 		=> preg_replace('/\.[^.]+$/', '', basename($fileName)),
     'post_content' 	=> '',
     'post_status' 		=> 'inherit'
  );
  $attach_id = wp_insert_attachment( $attachment, $fileName, $post_id );
  die(json_encode(array( 'jsonrpc' => '2.0', "result" => 'success', 'id' => $post_id ,'post_title' => $original_name)));
}


// Return JSON-RPC response
die('{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');


?>