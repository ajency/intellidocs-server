<?php
function file_download_option($actions, $post)
 {
 	
 	 if ($post->post_type =="document_files"){ 
	 $upload_dir = wp_upload_dir();  
 
		//$actions['download'] =  '<a href="'.admin_url('admin.php').'?page=download-file&filename='.$post->post_title.'">Download</a>';
		//$actions['download'] = '<a href="'.get_bloginfo('url').'/wp-content/uploads/'.$post->post_title.'">Download</a>';
 	
		return $actions;
	}
 	//post_type=document_files
 }
 
 
	/**
	 * Get File Extension
	 *
	 * Returns the file extension of a filename.
	 *
	 * @access      public
	 * @since       1.0
	 * @return      string
	 */
	function dmt_get_file_extension( $str ) {
		$parts = explode( '.', $str );
		return end( $parts );
	}
	

	/**
	 * Get File Extension
	 *
	 * Returns the file extension of a filename.
	 *
	 * @access      public
	 * @since       1.0
	 * @return      string
	 */
	function dmt_get_file_name_wo_ext( $str ) {
		$parts = explode( '.', $str );
		 return str_replace(".".end( $parts ), "",$str);
	}
	
	/**
	 * Get the file content type
	 *
	 * @access   public
	 * @param    string    file extension
	 * @return   string
	 */
	function dmt_get_file_ctype( $extension ) {
		switch( $extension ):
		case 'ac'		: $ctype	= "application/pkix-attr-cert"; break;
		case 'adp'		: $ctype	= "audio/adpcm"; break;
		case 'ai'		: $ctype	= "application/postscript"; break;
		case 'aif'		: $ctype	= "audio/x-aiff"; break;
		case 'aifc'		: $ctype	= "audio/x-aiff"; break;
		case 'aiff'		: $ctype	= "audio/x-aiff"; break;
		case 'air'		: $ctype	= "application/vnd.adobe.air-application-installer-package+zip"; break;
		case 'apk'		: $ctype	= "application/vnd.android.package-archive"; break;
		case 'asc'		: $ctype	= "application/pgp-signature"; break;
		case 'atom'		: $ctype	= "application/atom+xml"; break;
		case 'atomcat'	: $ctype	= "application/atomcat+xml"; break;
		case 'atomsvc'	: $ctype	= "application/atomsvc+xml"; break;
		case 'au'		: $ctype	= "audio/basic"; break;
		case 'aw'		: $ctype	= "application/applixware"; break;
		case 'avi'		: $ctype	= "video/x-msvideo"; break;
		case 'bcpio'	: $ctype	= "application/x-bcpio"; break;
		case 'bin'		: $ctype	= "application/octet-stream"; break;
		case 'bmp'		: $ctype	= "image/bmp"; break;
		case 'boz'		: $ctype	= "application/x-bzip2"; break;
		case 'bpk'		: $ctype	= "application/octet-stream"; break;
		case 'bz'		: $ctype	= "application/x-bzip"; break;
		case 'bz2'		: $ctype	= "application/x-bzip2"; break;
		case 'ccxml'	: $ctype	= "application/ccxml+xml"; break;
		case 'cdmia'	: $ctype	= "application/cdmi-capability"; break;
		case 'cdmic'	: $ctype	= "application/cdmi-container"; break;
		case 'cdmid'	: $ctype	= "application/cdmi-domain"; break;
		case 'cdmio'	: $ctype	= "application/cdmi-object"; break;
		case 'cdmiq'	: $ctype	= "application/cdmi-queue"; break;
		case 'cdf'		: $ctype	= "application/x-netcdf"; break;
		case 'cer'		: $ctype	= "application/pkix-cert"; break;
		case 'cgm'		: $ctype	= "image/cgm"; break;
		case 'class'	: $ctype	= "application/octet-stream"; break;
		case 'cpio'		: $ctype	= "application/x-cpio"; break;
		case 'cpt'		: $ctype	= "application/mac-compactpro"; break;
		case 'crl'		: $ctype	= "application/pkix-crl"; break;
		case 'csh'		: $ctype	= "application/x-csh"; break;
		case 'css'		: $ctype	= "text/css"; break;
		case 'cu'		: $ctype	= "application/cu-seeme"; break;
		case 'davmount'	: $ctype	= "application/davmount+xml"; break;
		case 'dbk'		: $ctype	= "application/docbook+xml"; break;
		case 'dcr'		: $ctype	= "application/x-director"; break;
		case 'deploy'	: $ctype	= "application/octet-stream"; break;
		case 'dif'		: $ctype	= "video/x-dv"; break;
		case 'dir'		: $ctype	= "application/x-director"; break;
		case 'dist'		: $ctype	= "application/octet-stream"; break;
		case 'distz'	: $ctype	= "application/octet-stream"; break;
		case 'djv'		: $ctype	= "image/vnd.djvu"; break;
		case 'djvu'		: $ctype	= "image/vnd.djvu"; break;
		case 'dll'		: $ctype	= "application/octet-stream"; break;
		case 'dmg'		: $ctype	= "application/octet-stream"; break;
		case 'dms'		: $ctype	= "application/octet-stream"; break;
		case 'doc'		: $ctype	= "application/msword"; break;
		case 'docx'		: $ctype	= "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; break;
		case 'dotx'		: $ctype	= "application/vnd.openxmlformats-officedocument.wordprocessingml.template"; break;
		case 'dssc'		: $ctype	= "application/dssc+der"; break;
		case 'dtd'		: $ctype	= "application/xml-dtd"; break;
		case 'dump'		: $ctype	= "application/octet-stream"; break;
		case 'dv'		: $ctype	= "video/x-dv"; break;
		case 'dvi'		: $ctype	= "application/x-dvi"; break;
		case 'dxr'		: $ctype	= "application/x-director"; break;
		case 'ecma'		: $ctype	= "application/ecmascript"; break;
		case 'elc'		: $ctype	= "application/octet-stream"; break;
		case 'emma'		: $ctype	= "application/emma+xml"; break;
		case 'eps'		: $ctype	= "application/postscript"; break;
		case 'epub'		: $ctype	= "application/epub+zip"; break;
		case 'etx'		: $ctype	= "text/x-setext"; break;
		case 'exe'		: $ctype	= "application/octet-stream"; break;
		case 'exi'		: $ctype	= "application/exi"; break;
		case 'ez'		: $ctype	= "application/andrew-inset"; break;
		case 'f4v'		: $ctype	= "video/x-f4v"; break;
		case 'fli'		: $ctype	= "video/x-fli"; break;
		case 'flv'		: $ctype	= "video/x-flv"; break;
		case 'gif'		: $ctype	= "image/gif"; break;
		case 'gml'		: $ctype	= "application/srgs"; break;
		case 'gpx'		: $ctype	= "application/gml+xml"; break;
		case 'gram'		: $ctype	= "application/gpx+xml"; break;
		case 'grxml'	: $ctype	= "application/srgs+xml"; break;
		case 'gtar'		: $ctype	= "application/x-gtar"; break;
		case 'gxf'		: $ctype	= "application/gxf"; break;
		case 'hdf'		: $ctype	= "application/x-hdf"; break;
		case 'hqx'		: $ctype	= "application/mac-binhex40"; break;
		case 'htm'		: $ctype	= "text/html"; break;
		case 'html'		: $ctype	= "text/html"; break;
		case 'ice'		: $ctype	= "x-conference/x-cooltalk"; break;
		case 'ico'		: $ctype	= "image/x-icon"; break;
		case 'ics'		: $ctype	= "text/calendar"; break;
		case 'ief'		: $ctype	= "image/ief"; break;
		case 'ifb'		: $ctype	= "text/calendar"; break;
		case 'iges'		: $ctype	= "model/iges"; break;
		case 'igs'		: $ctype	= "model/iges"; break;
		case 'ink'		: $ctype	= "application/inkml+xml"; break;
		case 'inkml'	: $ctype	= "application/inkml+xml"; break;
		case 'ipfix'	: $ctype	= "application/ipfix"; break;
		case 'jar'		: $ctype	= "application/java-archive"; break;
		case 'jnlp'		: $ctype	= "application/x-java-jnlp-file"; break;
		case 'jp2'		: $ctype	= "image/jp2"; break;
		case 'jpe'		: $ctype	= "image/jpeg"; break;
		case 'jpeg'		: $ctype	= "image/jpeg"; break;
		case 'jpg'		: $ctype	= "image/jpeg"; break;
		case 'js'		: $ctype	= "application/javascript"; break;
		case 'json'		: $ctype	= "application/json"; break;
		case 'jsonml'	: $ctype	= "application/jsonml+json"; break;
		case 'kar'		: $ctype	= "audio/midi"; break;
		case 'latex'	: $ctype	= "application/x-latex"; break;
		case 'lha'    	: $ctype  = "application/octet-stream"; break;
		case 'lrf'    	: $ctype  = "application/octet-stream"; break;
		case 'lzh'    	: $ctype  = "application/octet-stream"; break;
		case 'lostxml'	: $ctype	= "application/lost+xml"; break;
		case 'm3u'		: $ctype	= "audio/x-mpegurl"; break;
		case 'm4a'		: $ctype	= "audio/mp4a-latm"; break;
		case 'm4b'		: $ctype	= "audio/mp4a-latm"; break;
		case 'm4p'		: $ctype	= "audio/mp4a-latm"; break;
		case 'm4u'		: $ctype	= "video/vnd.mpegurl"; break;
		case 'm4v'		: $ctype	= "video/x-m4v"; break;
		case 'm21'		: $ctype	= "application/mp21"; break;
		case 'ma'		: $ctype	= "application/mathematica"; break;
		case 'mac'		: $ctype	= "image/x-macpaint"; break;
		case 'mads'		: $ctype	= "application/mads+xml"; break;
		case 'man'		: $ctype	= "application/x-troff-man"; break;
		case 'mar'		: $ctype	= "application/octet-stream"; break;
		case 'mathml'	: $ctype	= "application/mathml+xml"; break;
		case 'mbox'		: $ctype	= "application/mbox"; break;
		case 'me'		: $ctype	= "application/x-troff-me"; break;
		case 'mesh'		: $ctype	= "model/mesh"; break;
		case 'metalink'	: $ctype	= "application/metalink+xml"; break;
		case 'meta4'	: $ctype	= "application/metalink4+xml"; break;
		case 'mets'		: $ctype	= "application/mets+xml"; break;
		case 'mid'		: $ctype	= "audio/midi"; break;
		case 'midi'		: $ctype	= "audio/midi"; break;
		case 'mif'		: $ctype	= "application/vnd.mif"; break;
		case 'mods'		: $ctype	= "application/mods+xml"; break;
		case 'mov'		: $ctype	= "video/quicktime"; break;
		case 'movie'	: $ctype	= "video/x-sgi-movie"; break;
		case 'm1v'		: $ctype	= "video/mpeg"; break;
		case 'm2v'		: $ctype	= "video/mpeg"; break;
		case 'mp2'		: $ctype	= "audio/mpeg"; break;
		case 'mp2a'		: $ctype	= "audio/mpeg"; break;
		case 'mp21'		: $ctype	= "application/mp21"; break;
		case 'mp3'		: $ctype	= "audio/mpeg"; break;
		case 'mp3a'		: $ctype	= "audio/mpeg"; break;
		case 'mp4'		: $ctype	= "video/mp4"; break;
		case 'mp4s'		: $ctype	= "application/mp4"; break;
		case 'mpe'		: $ctype	= "video/mpeg"; break;
		case 'mpeg'		: $ctype	= "video/mpeg"; break;
		case 'mpg'		: $ctype	= "video/mpeg"; break;
		case 'mpg4'		: $ctype	= "video/mpeg"; break;
		case 'mpga'		: $ctype	= "audio/mpeg"; break;
		case 'mrc'		: $ctype	= "application/marc"; break;
		case 'mrcx'		: $ctype	= "application/marcxml+xml"; break;
		case 'ms'		: $ctype	= "application/x-troff-ms"; break;
		case 'mscml'	: $ctype	= "application/mediaservercontrol+xml"; break;
		case 'msh'		: $ctype	= "model/mesh"; break;
		case 'mxf'		: $ctype	= "application/mxf"; break;
		case 'mxu'		: $ctype	= "video/vnd.mpegurl"; break;
		case 'nc'		: $ctype	= "application/x-netcdf"; break;
		case 'oda'		: $ctype	= "application/oda"; break;
		case 'oga'		: $ctype	= "application/ogg"; break;
		case 'ogg'		: $ctype	= "application/ogg"; break;
		case 'ogx'		: $ctype	= "application/ogg"; break;
		case 'omdoc'	: $ctype	= "application/omdoc+xml"; break;
		case 'onetoc'	: $ctype	= "application/onenote"; break;
		case 'onetoc2'	: $ctype	= "application/onenote"; break;
		case 'onetmp'	: $ctype	= "application/onenote"; break;
		case 'onepkg'	: $ctype	= "application/onenote"; break;
		case 'opf'		: $ctype	= "application/oebps-package+xml"; break;
		case 'oxps'		: $ctype	= "application/oxps"; break;
		case 'p7c'		: $ctype	= "application/pkcs7-mime"; break;
		case 'p7m'		: $ctype	= "application/pkcs7-mime"; break;
		case 'p7s'		: $ctype	= "application/pkcs7-signature"; break;
		case 'p8'		: $ctype	= "application/pkcs8"; break;
		case 'p10'		: $ctype	= "application/pkcs10"; break;
		case 'pbm'		: $ctype	= "image/x-portable-bitmap"; break;
		case 'pct'		: $ctype	= "image/pict"; break;
		case 'pdb'		: $ctype	= "chemical/x-pdb"; break;
		case 'pdf'		: $ctype	= "application/pdf"; break;
		case 'pki'		: $ctype	= "application/pkixcmp"; break;
		case 'pkipath'	: $ctype	= "application/pkix-pkipath"; break;
		case 'pfr'		: $ctype	= "application/font-tdpfr"; break;
		case 'pgm'		: $ctype	= "image/x-portable-graymap"; break;
		case 'pgn'		: $ctype	= "application/x-chess-pgn"; break;
		case 'pgp'		: $ctype	= "application/pgp-encrypted"; break;
		case 'pic'		: $ctype	= "image/pict"; break;
		case 'pict'		: $ctype	= "image/pict"; break;
		case 'pkg'		: $ctype	= "application/octet-stream"; break;
		case 'png'		: $ctype	= "image/png"; break;
		case 'pnm'		: $ctype	= "image/x-portable-anymap"; break;
		case 'pnt'		: $ctype	= "image/x-macpaint"; break;
		case 'pntg'		: $ctype	= "image/x-macpaint"; break;
		case 'pot'		: $ctype	= "application/vnd.ms-powerpoint"; break;
		case 'potx'		: $ctype	= "application/vnd.openxmlformats-officedocument.presentationml.template"; break;
		case 'ppm'		: $ctype	= "image/x-portable-pixmap"; break;
		case 'pps'		: $ctype	= "application/vnd.ms-powerpoint"; break;
		case 'ppsx'		: $ctype	= "application/vnd.openxmlformats-officedocument.presentationml.slideshow"; break;
		case 'ppt'		: $ctype	= "application/vnd.ms-powerpoint"; break;
		case 'pptx'		: $ctype	= "application/vnd.openxmlformats-officedocument.presentationml.presentation"; break;
		case 'prf'		: $ctype	= "application/pics-rules"; break;
		case 'ps'		: $ctype	= "application/postscript"; break;
		case 'psd'		: $ctype	= "image/photoshop"; break;
		case 'qt'		: $ctype	= "video/quicktime"; break;
		case 'qti'		: $ctype	= "image/x-quicktime"; break;
		case 'qtif'		: $ctype	= "image/x-quicktime"; break;
		case 'ra'		: $ctype	= "audio/x-pn-realaudio"; break;
		case 'ram'		: $ctype	= "audio/x-pn-realaudio"; break;
		case 'ras'		: $ctype	= "image/x-cmu-raster"; break;
		case 'rdf'		: $ctype	= "application/rdf+xml"; break;
		case 'rgb'		: $ctype	= "image/x-rgb"; break;
		case 'rm'		: $ctype	= "application/vnd.rn-realmedia"; break;
		case 'rmi'		: $ctype	= "audio/midi"; break;
		case 'roff'		: $ctype	= "application/x-troff"; break;
		case 'rss'		: $ctype	= "application/rss+xml"; break;
		case 'rtf'		: $ctype	= "text/rtf"; break;
		case 'rtx'		: $ctype	= "text/richtext"; break;
		case 'sgm'		: $ctype	= "text/sgml"; break;
		case 'sgml'		: $ctype	= "text/sgml"; break;
		case 'sh'		: $ctype	= "application/x-sh"; break;
		case 'shar'		: $ctype	= "application/x-shar"; break;
		case 'sig'		: $ctype	= "application/pgp-signature"; break;
		case 'silo'		: $ctype	= "model/mesh"; break;
		case 'sit'		: $ctype	= "application/x-stuffit"; break;
		case 'skd'		: $ctype	= "application/x-koan"; break;
		case 'skm'		: $ctype	= "application/x-koan"; break;
		case 'skp'		: $ctype	= "application/x-koan"; break;
		case 'skt'		: $ctype	= "application/x-koan"; break;
		case 'sldx'		: $ctype	= "application/vnd.openxmlformats-officedocument.presentationml.slide"; break;
		case 'smi'		: $ctype	= "application/smil"; break;
		case 'smil'		: $ctype	= "application/smil"; break;
		case 'snd'		: $ctype	= "audio/basic"; break;
		case 'so'		: $ctype	= "application/octet-stream"; break;
		case 'spl'		: $ctype	= "application/x-futuresplash"; break;
		case 'spx'		: $ctype	= "audio/ogg"; break;
		case 'src'		: $ctype	= "application/x-wais-source"; break;
		case 'stk'		: $ctype	= "application/hyperstudio"; break;
		case 'sv4cpio'	: $ctype	= "application/x-sv4cpio"; break;
		case 'sv4crc'	: $ctype	= "application/x-sv4crc"; break;
		case 'svg'		: $ctype	= "image/svg+xml"; break;
		case 'swf'		: $ctype	= "application/x-shockwave-flash"; break;
		case 't'		: $ctype	= "application/x-troff"; break;
		case 'tar'		: $ctype	= "application/x-tar"; break;
		case 'tcl'		: $ctype	= "application/x-tcl"; break;
		case 'tex'		: $ctype	= "application/x-tex"; break;
		case 'texi'		: $ctype	= "application/x-texinfo"; break;
		case 'texinfo'	: $ctype	= "application/x-texinfo"; break;
		case 'tif'		: $ctype	= "image/tiff"; break;
		case 'tiff'		: $ctype	= "image/tiff"; break;
		case 'torrent'	: $ctype	= "application/x-bittorrent"; break;
		case 'tr'		: $ctype	= "application/x-troff"; break;
		case 'tsv'		: $ctype	= "text/tab-separated-values"; break;
		case 'txt'		: $ctype	= "text/plain"; break;
		case 'ustar'	: $ctype	= "application/x-ustar"; break;
		case 'vcd'		: $ctype	= "application/x-cdlink"; break;
		case 'vrml'		: $ctype	= "model/vrml"; break;
		case 'vsd'		: $ctype	= "application/vnd.visio"; break;
		case 'vss'		: $ctype	= "application/vnd.visio"; break;
		case 'vst'		: $ctype	= "application/vnd.visio"; break;
		case 'vsw'		: $ctype	= "application/vnd.visio"; break;
		case 'vxml'		: $ctype	= "application/voicexml+xml"; break;
		case 'wav'		: $ctype	= "audio/x-wav"; break;
		case 'wbmp'		: $ctype	= "image/vnd.wap.wbmp"; break;
		case 'wbmxl'	: $ctype	= "application/vnd.wap.wbxml"; break;
		case 'wm'		: $ctype	= "video/x-ms-wm"; break;
		case 'wml'		: $ctype	= "text/vnd.wap.wml"; break;
		case 'wmlc'		: $ctype	= "application/vnd.wap.wmlc"; break;
		case 'wmls'		: $ctype	= "text/vnd.wap.wmlscript"; break;
		case 'wmlsc'	: $ctype	= "application/vnd.wap.wmlscriptc"; break;
		case 'wmv'		: $ctype	= "video/x-ms-wmv"; break;
		case 'wmx'		: $ctype	= "video/x-ms-wmx"; break;
		case 'wrl'		: $ctype	= "model/vrml"; break;
		case 'xbm'		: $ctype	= "image/x-xbitmap"; break;
		case 'xdssc'	: $ctype	= "application/dssc+xml"; break;
		case 'xer'		: $ctype	= "application/patch-ops-error+xml"; break;
		case 'xht'		: $ctype	= "application/xhtml+xml"; break;
		case 'xhtml'	: $ctype	= "application/xhtml+xml"; break;
		case 'xla'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xlam'		: $ctype	= "application/vnd.ms-excel.addin.macroEnabled.12"; break;
		case 'xlc'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xlm'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xls'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xlsx'		: $ctype	= "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; break;
		case 'xlsb'		: $ctype	= "application/vnd.ms-excel.sheet.binary.macroEnabled.12"; break;
		case 'xlt'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xltx'		: $ctype	= "application/vnd.openxmlformats-officedocument.spreadsheetml.template"; break;
		case 'xlw'		: $ctype	= "application/vnd.ms-excel"; break;
		case 'xml'		: $ctype	= "application/xml"; break;
		case 'xpm'		: $ctype	= "image/x-xpixmap"; break;
		case 'xsl'		: $ctype	= "application/xml"; break;
		case 'xslt'		: $ctype	= "application/xslt+xml"; break;
		case 'xul'		: $ctype	= "application/vnd.mozilla.xul+xml"; break;
		case 'xwd'		: $ctype	= "image/x-xwindowdump"; break;
		case 'xyz'		: $ctype	= "chemical/x-xyz"; break;
		case 'zip'		: $ctype	= "application/zip"; break;
		default			: $ctype	= "application/force-download";
		endswitch;
	 
	}
	
	
 //add_filter('post_row_actions','file_download_option',10,2);
 function do_download()
{
	if(isset($_REQUEST["filename"]) && isset($_REQUEST["page"]) && isset($_REQUEST["folder"]))
	{
		if (dmt_check_users_folders($_REQUEST["folder"])|| current_user_can( 'manage_options' )|| current_user_can( 'administrate' ))
			{
				if($_REQUEST["page"]=="download-file")
				{	
					$file_id=$_REQUEST["filename"];
					$attachment_args = array(
					 'post_type' => 'attachment',
					 'numberposts' => -1,
					 'post_status' => null,
					 'post_parent' => $file_id,
					 );
					 $attachments = get_posts($attachment_args);
					 $filename = basename ( get_attached_file( $attachments[0]->ID ) ); 
					// $filenamepath= wp_get_attachment_url($attachments[0]->ID);
					 $upload_dir = wp_upload_dir(); 
					//$id = get_post_thumbnail_id($filename);
					 $filenamepath=  $upload_dir['basedir']."/".$filename;
					//$display_name = html_entity_decode(str_replace("&#8217","",get_the_title($file_id))); 
					//$display_name =  (str_replace(";","",$display_name)); 
					// $display_name = get_the_title($file_id) ;
				 	$file_extension =  dmt_get_file_extension( $filename );
					$ctype          =  dmt_get_file_ctype( $file_extension );
					header("Content-Type: " . $ctype . "");
					header("Content-Disposition: attachment; filename=".$filename);
					//header("Content-Type: application/octet-stream");
					//header("Content-Disposition: attachment; filename=".$filename);
					 $str = readfile(trim($filenamepath));
					 exit();
				}
			}
			else
			{
				wp_redirect(home_url().'/wp-admin/admin.php?page=intellidocs-document-files');
				exit(0);
			}
	} 
		
}
 add_action('init','do_download');
 
 
  
add_filter('wp_get_attachment_url', 'honor_ssl_for_attachments');
function honor_ssl_for_attachments($url) {
 $http = site_url(FALSE, 'http');
 $https = site_url(FALSE, 'https');
 return ( $_SERVER['HTTPS'] == 'on' ) ? str_replace($http, $https, $url) : $url;
}
//functions to load file list for subscribers
function dmt_manage_document() {
	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	require_once('subscribers_file_list.php');

}

function dmt_list_document_folder() {
	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	require_once('document_folder.php');

}


 function dmt_get_current_user_role()
{
	global $user_ID;

	$user = new WP_User( $user_ID );

	$role= "";
	if ( !empty( $user->roles ) && is_array( $user->roles ) ) {
		foreach ( $user->roles as $role ){
			return $role;
		}
			
	}

}
 function dmt_get_current_user_folders()
{
	global $user_ID,$wpdb;
	
	$user_access_table = $wpdb->prefix . "dmt_user_cat_access_data";
	$user_group = $wpdb->prefix . "dmt_user_group";
	$group_folder = $wpdb->prefix . "dmt_group_folder";
	
	$access_folders = $wpdb->get_results( "
										SELECT category_id
										FROM $user_access_table
										WHERE user_id = $user_ID
										UNION
										SELECT folder_id
										FROM $user_group,$group_folder 
										WHERE $user_group.group_id = $group_folder.group_id and user_id  = $user_ID
										");	
	$user_accessfolders = array();
	foreach ($access_folders as $access_folderval)
	{
		if(dmt_check_folder_status_is_published($access_folderval->category_id))
		{
			$user_accessfolders[] =intval($access_folderval->category_id);
		}
	} 
	 
	return $user_accessfolders;

}
function dmt_recurse_find_parent_folder_ids($cat_id,$folder_ids = '')
	{ 
		$term = get_term_by( 'id', $cat_id , 'document_folders');
		$folder_ids .= ','.$term->parent;
		
		if($term->parent != 0)
		{
			return dmt_recurse_find_parent_folder_ids($term->parent,$folder_ids);
		}
		else
		{
			$folder_ids =  explode(",",$folder_ids) ; 
			$folder_ids = array_map(create_function('$value', 'return (int)$value;'),$folder_ids);
			return ($folder_ids);
		}
	}
	
function dmt_check_users_folders($folder_id)
{
	$accessfolders = dmt_recurse_find_parent_folder_ids($folder_id,$folder_id);
				 
	$accesscategory = dmt_get_current_user_folders();
	 
	foreach ($accesscategory as $accesscategoryval)
	{ 
		if(in_array($accesscategoryval,$accessfolders))
		{
			return true;
		}
	}
	

}

function dmt_change_password_page()
{

	if ( !current_user_can( 'read' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	include_once 'change-password.php';
}
function dmt_menu_page_subscriber() { 
	
	if (dmt_get_current_user_role()=="subscriber"){
		$imgpath = str_replace('/includes/img/','/img/',plugins_url( '/img/menu-icon.png', __FILE__ ));
		//add_menu_page('Manage Documents', 'Manage Documents', 'read', 'manage-document', 'dmt_manage_document',  $imgpath, 7);
		//add_submenu_page('manage-document', 'Document Folders', 'Document Folders', 'read', 'list-document-folder', 'dmt_list_document_folder' ); 
	//	add_menu_page('Document Folders', 'Document Folders', 'read', 'list-document-folder', 'dmt_list_document_folder',  $imgpath, 7);
		//add_submenu_page('dmt_manage_document', 'Manage Documents', 'Manage Documents', 'read', 'manage-document', 'dmt_manage_document' );
		add_menu_page('Change Password', 'Change Password', 'read', 'change-password', 'dmt_change_password_page', '', 8);
	
		global $menu;
		$restricted = array(__('Profile'),__('Add'));
		end ($menu);
		while (prev($menu)){
			$value = explode(' ',$menu[key($menu)][0]); 
			if(in_array($value[0] != NULL?$value[0]:"" , $restricted)){unset($menu[key($menu)]);}
			}
	}
	

	if (dmt_get_current_user_role()=="dmt_site_admin"){
	 	global $menu;
		$restricted = array(__('Formidable'));
		end ($menu);
		while (prev($menu)){
			$value = explode(' ',$menu[key($menu)][0]);
			if(in_array($value[0] != NULL?$value[0]:"" , $restricted)){unset($menu[key($menu)]);}
		}
	}
}
 add_action('admin_menu', 'dmt_menu_page_subscriber',11); 
 
 
 function dmt_login_redirect_subscriber ($redirect_to, $request, $user) {
	 if (isset($user->roles))
	{
		if(in_array('subscriber',$user->roles))
		{
			return 'wp-admin/admin.php?page=intellidocs-document-files';
		}
		if(in_array('administrator',$user->roles) || in_array('dmt_site_admin',$user->roles))
		{
			return 'wp-admin/edit.php?post_type=document_files&page=add-document-folders';
		}
	}
	
	return $redirect_to;
  
 } 
 
 add_filter('login_redirect', 'dmt_login_redirect_subscriber',10,3);
 
 /**
 * Add a menu page to backend
 */
 
 
 function dmt_show_menu_page_add_group()
{
	$user_role = dmt_get_current_user_role();
	if (  ($user_role  != "dmt_site_admin" && $user_role  !="administrator" && !current_user_can('manage_groups')))  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	include_once 'manage-groups.php';
}

/**
 * Add a menu page to backend
 */


function dmt_show_menu_page_add_document_folders()
{
	$user_role = dmt_get_current_user_role();
	if (  ($user_role  != "dmt_site_admin" && $user_role  !="administrator" && !current_user_can('administrate')))  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	include_once 'add-document-folders.php';
}
//function added by Surekha//
function dmt_show_menu_page_add_division()
{
	$user_role = dmt_get_current_user_role();
	if ( !current_user_can('manage_divisions'))  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
include_once 'manage-division.php';
}
function dmt_add_manage_group_page()
{    
	$user_role = dmt_get_current_user_role();
	if ($user_role  == "dmt_site_admin" || $user_role  =="administrator" || current_user_can('manage_groups'))
	{
		add_submenu_page('edit.php?post_type=document_files', 'Manage Groups', 'Manage Groups', 'edit_posts', 'manage-groups', 'dmt_show_menu_page_add_group' );  
		add_submenu_page('edit.php?post_type=document_files', 'Add Document Folders', 'Add Document Folders', 'edit_posts', 'add-document-folders', 'dmt_show_menu_page_add_document_folders' );
		 
	}
	if ( current_user_can('manage_divisions'))
	{
	add_submenu_page('edit.php?post_type=document_files', 'Manage Division', 'Manage Division', 'edit_posts', 'add-division', 'dmt_show_menu_page_add_division' );
}
	
}
add_action( 'admin_menu', 'dmt_add_manage_group_page' );

//Group Manage functions

 

 
function get_group_select_box($group_id=0)
{
	global $wpdb;
	
	 
	$groupdata = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}dmt_group ORDER BY group_name ", ARRAY_A);
	
	$str  = '';
	
	$str .= '<option value="">Select Group</option>';
	foreach($groupdata as $groupdatavalues) { 
		$checked = "";
		if($group_id==$groupdatavalues['ID'])
		{
			$checked = "checked";
		}
		$str .= '<option value="'.$groupdatavalues['ID'].'" '.$checked.'>'.$groupdatavalues['group_name'].'</option>';
			}
			 
	$str .= '';
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }
}

add_action('wp_ajax_get_group_select_box','get_group_select_box');


function get_available_users()
{
	global $wpdb;
	$event =  $_REQUEST['event'];
	$group_id = isset($_REQUEST['group_id']) ? intval($_REQUEST['group_id']) : 0;
	$str ="";
	if ($group_id !=0)
	{
		$selected_users = array();
		$result_users =$wpdb->get_results("SELECT user_id FROM {$wpdb->prefix}dmt_user_group where group_id = $group_id ", ARRAY_A);
		foreach ($result_users as $result_usersval) 
		{
			$selected_users[] = intval($result_usersval["user_id"]);  
		}
		$userdata = $wpdb->get_results("SELECT id,display_name FROM {$wpdb->prefix}users   ORDER BY display_name ", ARRAY_A);
		$str .='<ul class="dmtDocumentFolderStructure">';
		$sort_users = array();
		$checked_users = array();
		$unchecked_users = array();
		$disabled = "disabled";
		foreach($userdata as $userdatavalues) {
			
			if($selected_users):
			$checked = (in_array($userdatavalues['id'],$selected_users))?'checked="checked"':'notchecked';
			endif;
			  
			if($checked=='checked="checked"')
			{
				$checked_users[] = array("users_data"=>$userdatavalues,"sort"=>$checked,'display_name'=>strtolower($userdatavalues["display_name"]));
			}
			else
			{  
				if($event =="add group members"){
					 
					$unchecked_users[] = array("users_data"=>$userdatavalues,"sort"=>$checked,'display_name'=>strtolower($userdatavalues["display_name"])); 
				}
				
			} 
			 
			
		} 
 if($event =="add group members"){
					$disabled = "";
				}
		$sort_users = array_merge(aasort($checked_users,"display_name"),aasort($unchecked_users,"display_name"));
		foreach($sort_users as $userdatavalues) {
		 
			if($selected_users):  
					  $checked = (in_array($userdatavalues['users_data']['id'],$selected_users))?'checked="checked"':'';  
				endif; 
				$str .='<li>';
				$str .='<label class="selectit">';
				$str .= '<input type="checkbox"  name="available_user" id="available_user" class="available_user" value="'.$userdatavalues['users_data']['id'].'" '.$checked.' '.$disabled.'> '.$userdatavalues['users_data']['display_name'];
				$str .='</label>';
				$str .='</li>';
			 
		}
		
	$str .='</ul>'; 
	}
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }
}



add_action('wp_ajax_get_available_users','get_available_users');

 

function add_groups()
{ 
	$group_name = $_POST['group_name']; 
	 
	global $wpdb;
	$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group (group_name)values ('".$group_name."')");	
	 
	echo "<p>Group Added Successfully</p>"; 

	die();	
}
add_action('wp_ajax_add_groups','add_groups'); 

function update_group_name()
{ 
	$group_name = $_POST['group_name']; 
	$group_id = $_POST['group_id']; 
	 
	global $wpdb;
	$result = $wpdb->get_results("update   {$wpdb->prefix}dmt_group set group_name = '".$group_name."' where id = $group_id");	
	 
	echo "<p>Group Name Updated Successfully</p>"; 

	die();	
}
add_action('wp_ajax_update_group_name','update_group_name'); 

function get_all_folders()
{ 

	global $wpdb;
	$str="";
	$group_id = $_POST['group_id']; 

	$event = $_POST['event']; 

		$disabled = "disabled";
	 
	 $parent_args = array(
 	'type'                     => 'post',
	'child_of'                 => 0,
	'parent'                   => 0,
	'orderby'                  => 'name',
	'order'                    => 'ASC',
	'hide_empty'               => 0,
	'hierarchical'             => 0,
	'taxonomy'                 => 'document_folders',
	'pad_counts'               => false
 	);
	
	$categories = get_categories( $parent_args );
	$selected_folderss = "";
	//$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group (group_name)values ('".$group_name."')");	
	$selected_folders = array();
	$sort_category = array();
	$checked_category = array();
	$unchecked_category = array();
	$result_folders =$wpdb->get_results("SELECT folder_id FROM {$wpdb->prefix}dmt_group_folder where group_id = $group_id ", ARRAY_A);
	foreach ($result_folders as $result_foldersval) 
	{
		$selected_folders[] = intval($result_foldersval["folder_id"]);  
	}
	$str .='<ul class="dmtDocumentFolderStructure">';
 
	  
	  foreach($categories as $category) {
	  		
	  	if($selected_folders):  
					  $checked = (in_array($category->cat_ID,$selected_folders))?'checked="checked"':'notchecked';  
				endif; 
	  
	  		
	  	if($checked=='checked="checked"')
	  	{
	  		$checked_category[] = array("category_data"=>$category,"sort"=>$checked,'cat_name'=>strtolower($category->cat_name));
	  	}
	  	else
	  	{
	  		if($event=="add group folders"){
	  		$unchecked_category[] = array("category_data"=>$category,"sort"=>$checked,'cat_name'=>strtolower($category->cat_name));	
	  		}
	  		
	  	}
	  
	  		
	  }
	  if($event=="add group folders"){
	  	$disabled = "";
	  };
	  $sort_category = array_merge(aasort($checked_category,"cat_name"),aasort($unchecked_category,"cat_name"));
	 
	  foreach($sort_category as $category):
	 
		  	$checked = ( $category['sort']);
		 
		  $str .='<li>';
		  $str .='<label class="selectit">';
		  $str .='<input value="'.$category["category_data"]->cat_ID.'" type="checkbox" name="folder_list" id="folder_list"  class="folder_list" '.$checked.' '.$disabled .'/> '.$category["category_data"]->cat_name;
		  $str .='</label>';
		  $str .='</li>';
	  endforeach ;
	$str .='</ul>'; 
	 
	echo $str; 

	die();	
}
add_action('wp_ajax_get_all_folders','get_all_folders'); 



function add_folders_to_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$folder_ids = $_POST['folder_ids'];
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group_folder where group_id = ".$group_id);	
	if($folder_ids)
	{
		foreach($folder_ids as $folder_id)
		{
			$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_group_folder (group_id,folder_id)values (".$group_id.",".$folder_id.")");	
		 }
	}
	echo "<p>Group Folders Updated Successfully</p>"; 

	die();	
}
add_action('wp_ajax_add_folders_to_group','add_folders_to_group'); 


function add_users_to_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$user_ids = $_POST['user_ids'];
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_user_group where group_id = ".$group_id);	
	if($user_ids)
	{
		foreach($user_ids as $user_id)
		{
			$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_user_group (group_id,user_id)values (".$group_id.",".$user_id.")");	
		 }
	}
	echo "<p>Group Users Updated Successfully</p>"; 

	die();	
}

function get_group_actions($group_id)
{ 

	global $wpdb;
	 
	 
	echo '<input id="delete-group-button" group-id="'.$group_id.'" type="button" value="x" class="button"><input id="delete-group-button" group-id="'.$group_id.'" type="button" value="x" class="button">'; 

	die();	
}
add_action('wp_ajax_add_users_to_group','add_users_to_group'); 


function delete_group()
{ 

	global $wpdb;
	
	$group_id = $_POST['group_id']; 
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group where id = ".$group_id);	
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_user_group where group_id = ".$group_id);	
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_group_folder where group_id = ".$group_id);	
	 
	echo "<p>Group Deleted Successfully</p>"; 

	die();	
}
add_action('wp_ajax_delete_group','delete_group'); 

function dmt_change_password_dashboard()
{ 

	global $wpdb,$user_ID;
	
	$user_pass1 = $_POST['user_pass1']; 
	
	wp_set_password( $user_pass1, $user_ID );
	 
	echo "<p>Your Password Has Been Reset Successfully. Please Wait While You Are Being Redirected To The Login Page.</p>"; 

	die();	
}
add_action('wp_ajax_dmt_change_password','dmt_change_password_dashboard'); 


function dmt_add_folder()
{
 

	$tag_name = $_POST['tag_name'];
	
	$parent = $_POST['parent'];
	
	$tag_description = $_POST['tag_description'];
	$error_msg = '';
	$term = term_exists($tag_name, 'document_folders',$parent);
	if ($term !== 0 && $term !== null) {
		$error_msg =  "<p  ><font  color='red'>'$tag_name' document folder already exists!</font></p>";
	}
	else
	{
		$term_data = wp_insert_term( $tag_name, 'document_folders',  array(
				'description'=> $tag_description,
				'slug' => '',
				'parent'=> $parent
		) );
		
		$msg =  "<p>Document Folder Added Successfully.</p>";
		$parent = wp_dropdown_categories(array('hide_empty' => 0, 'hide_if_empty' => false, 'taxonomy' => 'document_folders', 'name' => 'parent', 'orderby' => 'name', 'hierarchical' => true, 'echo' => 0, 'show_option_none' => __('None')));
		$parent =strip_tags($parent, '<option>');
	}
	

	$response = json_encode( array( 'msg' =>  $msg ,'parent'=> $parent,'error_msg'=>$error_msg) );
	header( "Content-Type: application/json" );
	echo $response;

	die();
}
add_action('wp_ajax_dmt_add_folder','dmt_add_folder');

//code added by surekha////

add_action('wp_ajax_get_selectbox_division','get_selectbox_division');
add_action('wp_ajax_get_dmt_users','get_dmt_users');
add_action('wp_ajax_add_division_to_memebers','add_division_to_memebers'); 
function get_selectbox_division()
{

  
$taxonomies = get_terms( 'document_folders',array(
 	'orderby'    => 'name',
 	'hide_empty' => 0,
	 'parent' =>0, 
	 'hierarchical'  => true
 ) );

global $wpdb;
	
	 
	//$groupdata = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}dmt_group ORDER BY group_name ", ARRAY_A);
	
	$str  = '';
	
	$str .= '<option value="">select option</option>';
	
foreach ( $taxonomies as $term ) {
     $str.="<option value='".$term->term_id."'>" . $term->name . "</option>";
        
     }		
	
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }

}
function get_dmt_users()
{
	
	global $wpdb;
	$event =  $_REQUEST['event'];
	$group_id = isset($_REQUEST['group_id']) ? intval($_REQUEST['group_id']) : 0;
	$str ="";
 
$selected_users = array();
		$result_users =$wpdb->get_results("SELECT ID,user_id FROM {$wpdb->prefix}dmt_user_cat_access_data where category_id = $group_id ", ARRAY_A);
		foreach ($result_users as $result_usersval) 
		{
			$selected_users[] = intval($result_usersval["user_id"]);  
		}
		
$userdata = get_users('orderby=nicename&role=dmt_site_admin');
$str .='<ul class="dmtDocumentFolderStructure">';
	$sort_users = array();
		$checked_users = array();
		$unchecked_users = array();
		$disabled = "disabled";
	foreach($userdata as $userdatavalues) {
			
			if($selected_users):
			$checked = (in_array($userdatavalues->ID,$selected_users))?'checked="checked"':'notchecked';
			endif;
			  
			if($checked=='checked="checked"')
			{
				$checked_users[] = array("users_data"=>$userdatavalues,"sort"=>$checked,'display_name'=>strtolower($userdatavalues->user_nicename));
			}
			else
			{  
				if($event =="add group members"){
					 
					$unchecked_users[] = array("users_data"=>$userdatavalues,"sort"=>$checked,'display_name'=>strtolower($userdatavalues->user_nicename)); 
				}
				
			} 
			 
			
		}
		 if($event =="add group members"){
					$disabled = "";
				}
		$sort_users = array_merge(aasort($checked_users,"user_nicename"),aasort($unchecked_users,"user_nicename"));
		foreach($sort_users as $userdatavalues) {
		 
			if($selected_users):  
					  $checked = (in_array($userdatavalues['users_data']->ID,$selected_users))?'checked="checked"':'';  
				endif; 
			
				$str .='<li>';
				$str .='<label class="selectit">';
				$str .= '<input type="checkbox"  name="available_user" id="available_user" class="available_user" value="'.$userdatavalues['users_data']->ID.'" '.$checked.' '.$disabled.'> '.$userdatavalues['users_data']->user_nicename;
				$str .='</label>';
				$str .='</li>';
			 
		}
		
		$str .='</ul>'; 
	echo $str;
	if (isset($_POST['call_by']))
	{
	 die();
	 }
}
function add_division_to_memebers()
{
global $wpdb;
	$table_name = $wpdb->prefix . "dmt_user_cat_access_data";
	$group_id = $_POST['group_id']; 
	
	$user_ids = $_POST['user_ids'];
	
	$result = $wpdb->get_results("delete from {$wpdb->prefix}dmt_user_cat_access_data where category_id = ".$group_id);	
	if($user_ids)
	{
	
		foreach($user_ids as $user_id)
		{
		
			//$result = $wpdb->get_results("insert into {$wpdb->prefix}dmt_user_cat_access_data (category_id,user_id)values (".$group_id.",".$user_id.")");	
		  $wpdb->insert( $table_name, array( 'user_id' => $user_id, 'category_id' => $group_id ) );
		  }
	}
	echo "<p>Division Memebers Updated Successfully</p>"; 

	die();
}
//code added by surekha////



/*function modify_post_title( $data , $postarr )
{
	if($data['post_type'] == 'document_files') {
		
		$file_name = dmt_get_file_name_wo_ext($data['post_title']);
		$file_ext = dmt_get_file_extension($data['post_title']);
		$file_title = sanitize_title_with_dashes($file_name).".".$file_ext;
		$data['post_title'] =  $file_title;
	}
	return $data;
}
add_filter( 'wp_insert_post_data' , 'modify_post_title' , '99', 2 );*/



///create new role intellidocs_admin


function create_new_role(){
	global $wp_roles;
	$dmtadmin = $wp_roles->get_role('dmt_site_admin');
    //Adding a 'intellidocs_admin' with all dmt_site_admin caps
	$result  =   $wp_roles->add_role('intellidocs_admin', 'Intellidocs Admin', $dmtadmin->capabilities);

	if ( null !== $result ) {
		$role = get_role( 'intellidocs_admin' );

		if(!$role->has_cap( 'manage_divisions'))
		{
			$role->add_cap( 'manage_divisions' );
		}
		if(!$role->has_cap( 'manage_groups'))
		{
			$role->add_cap( 'manage_groups' );
		}

		if(!$role->has_cap( 'administrate'))
		{
			$role->add_cap( 'administrate' );
		}
	} 
 
		
}
add_action('init','create_new_role');


function intellidocs_user_actions( $actions, $user_object ) {
	global $user_ID, $wp_roles;
	

	if ( is_user_logged_in() ) {
		$user = new WP_User( $user_ID );
		if ( !empty( $user->roles ) && is_array( $user->roles ) ) {
			foreach ( $user->roles as $role )
				$role =  $role;
		}
	}
	

	if(isset($user_object->wp_capabilities["intellidocs_admin"]) &&  $role !="intellidocs_admin"){

		$actions = array();
	}
	return $actions;
}

add_filter( 'user_row_actions', 'intellidocs_user_actions', 10, 2 );