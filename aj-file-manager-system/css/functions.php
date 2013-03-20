<?php

/*-----------------------------------------------------------------------------------*/
/* Start qc2Themes Functions - Please refrain from editing this section */
/*-----------------------------------------------------------------------------------*/

// Set path to qc2Framework and theme specific functions
$functions_path = TEMPLATEPATH . '/functions/';
$includes_path = TEMPLATEPATH . '/includes/';

// qc2Framework
require_once ($functions_path . 'admin-init.php');		// Framework Init

// Theme specific functionality
require_once ($includes_path . 'theme-options.php'); 		// Options panel settings and custom settings
require_once ($includes_path . 'theme-functions.php'); 	// Custom theme functions
require_once ($includes_path . 'theme-actions.php'); 		// Custom theme actions
require_once ($includes_path . 'theme-comments.php'); 		// Custom comments/pingback loop
require_once ($includes_path . 'theme-js.php');			// Load javascript in wp_head
require_once ($includes_path . 'sidebar-init.php');		// Initialize widgetized sidebar areas
require_once ($includes_path . 'theme-widgets.php');		// Theme widgets
require_once ($includes_path . 'likethis.php');	          // Likethis Plugin

/*-----------------------------------------------------------------------------------*/
/* You can add custom functions below */
/*-----------------------------------------------------------------------------------*/

// Limit the number of words in the wp excerpt

function string_limit_words($string, $word_limit)
{
  $words = explode(' ', $string, ($word_limit + 1));
  if(count($words) > $word_limit)
  array_pop($words);
  return implode(' ', $words);
}
function codex_custom_init() {
  $labels = array(
    'name' => _x('Trails', 'post type general name'),
    'singular_name' => _x('Trail', 'post type singular name'),
    'add_new' => _x('Add New', 'trail'),
    'add_new_item' => __('Add New Trail'),
    'edit_item' => __('Edit Trail'),
    'new_item' => __('New Trail'),
    'all_items' => __('All Trails'),
    'view_item' => __('View Trails'),
    'search_items' => __('Search Trails'),
    'not_found' =>  __('No trails found'),
    'not_found_in_trash' => __('No trails found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => 'Trails'

  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
	'menu_icon'=> get_bloginfo('template_url').'/images/35px-Trails.png',
    'capability_type' => 'post',
    'has_archive' => true, 
    'hierarchical' => false,
    'menu_position' => null,
    'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' ),
	'register_meta_box_cb'=>'additional_trail_data',
	'taxonomies'=> array('category','post_tag'),
	'rewrite'=>false
  ); 
  register_post_type('action_magnet_trails',$args);
  register_post_type( 'claimed_trail',
		array(
			'labels' => array(
				'name' => __( 'Claimed Trails' ),
				'singular_name' => __( 'Claimed Trail' )
			),
			'public' => true,
			'has_archive' => true,
			'rewrite' => false
		)
	);
}
add_action( 'init', 'codex_custom_init' );

function codex_trail_updated_messages( $messages ) {
  global $post, $post_ID;

  $messages['action_magnet_trails'] = array(
    0 => '', // Unused. Messages start at index 1.
    1 => sprintf( __('Trail updated. <a href="%s">View trail</a>'), esc_url( get_permalink($post_ID) ) ),
    2 => __('Custom field updated.'),
    3 => __('Custom field deleted.'),
    4 => __('Trail updated.'),
    /* translators: %s: date and time of the revision */
    5 => isset($_GET['revision']) ? sprintf( __('Trail restored to revision from %s'), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
    6 => sprintf( __('Trail published. <a href="%s">View trail</a>'), esc_url( get_permalink($post_ID) ) ),
    7 => __('Book saved.'),
    8 => sprintf( __('Trail submitted. <a target="_blank" href="%s">Preview trail</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
    9 => sprintf( __('Trail scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview trail</a>'),
      // translators: Publish box date format, see http://php.net/date
      date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) ), esc_url( get_permalink($post_ID) ) ),
    10 => sprintf( __('Trail draft updated. <a target="_blank" href="%s">Preview trail</a>'), esc_url( add_query_arg( 'preview', 'true', get_permalink($post_ID) ) ) ),
  );

  return $messages;
}
add_filter( 'post_updated_messages', 'codex_trail_updated_messages' );

function codex_add_help_text( $contextual_help, $screen_id, $screen ) { 
  //$contextual_help .= var_dump( $screen ); // use this to help determine $screen->id
  if ( 'action_magnet_trails' == $screen->id ) {
    $contextual_help =
      '<p>' . __('Things to remember when adding or editing a trail:') . '</p>' .
      '<ul>' .
      '<li>' . __('The trail should exist and must be traversed atleast once.') . '</li>' .
      '<li>' . __('Don\'t forget to add the difficulty level associated with each trail.') . '</li>' .
      '</ul>' .
      '<p><strong>' . __('For more information:') . '</strong></p>' .
      '<p>' . __('<a href="http://codex.wordpress.org/Posts_Edit_SubPanel" target="_blank">Edit Posts Documentation</a>') . '</p>' .
      '<p>' . __('<a href="http://wordpress.org/support/" target="_blank">Support Forums</a>') . '</p>' ;
  } elseif ( 'edit-action_magnet_trails' == $screen->id ) {
    $contextual_help = 
      '<p>' . __('This screen displays a list of all trails published by the site user.') . '</p>' ;
  }
  return $contextual_help;
}
add_action( 'contextual_help', 'codex_add_help_text', 10, 3 );

function additional_trail_data() {
     $var1 = 'this';
     $var2 = 'that';
     add_meta_box( 

           'am_trail_information',
           'Addittional Trail Information',
           'am_trail_information_input',
           'action_magnet_trails',
           'normal',
           'high'
      );
}

// $post is an object containing the current post (as a $post object)
// $metabox is an array with metabox id, title, callback, and args elements. 
// The args element is an array containing your passed $callback_args variables.

function am_trail_information_input ( $post, $metabox ) {
  
  
  $location = (get_post_meta($post->ID,"am_trail_location",true))? '"'.get_post_meta($post->ID,"am_trail_location",true).'"':'"Add trail location here" onfocus="this.value=\'\'"';
  $distance = (get_post_meta($post->ID,"am_trail_distance",true))?'"'.get_post_meta($post->ID,"am_trail_distance",true).'"':'"Add trail distance here" onfocus="this.value=\'\'"';
  $difficulty = (get_post_meta($post->ID,"am_trail_difficulty",true))? '"'.get_post_meta($post->ID,"am_trail_difficulty",true).'"':'"Add trail difficulty here" onfocus="this.value=\'\'"';
  
   // Use nonce for verification
  wp_nonce_field( plugin_basename( __FILE__ ), 'am_trail_location_nonce' );

  // The actual fields for data entry
  echo '<p><label for="am_location_field">';
       _e("Location:", 'action_magnet' );
  echo '</label> ';
    echo '<input type="text" id="am_location_field" name="am_location_field" value='.$location.' size="25" /></p>';
  
 echo '<p><label for="am_distance_field">';
       _e("Distance:", 'action_magnet' );
  echo '</label> ';
  echo '<input type="text" id="am_distance_field" name="am_distance_field" value='.$distance.' size="25" /></p>';
  
  echo '<p><label for="am_difficulty_field">';
       _e("Difficulty:", 'action_magnet' );
  echo '</label> ';
  echo '<input type="text" id="am_difficulty_field" name="am_difficulty_field" value='.$difficulty.' size="25"  /></p>';
  
}
add_action( 'save_post', 'am_save_traildata' );
function am_save_traildata( $post_id ) {
 
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
      return;

  if ( !wp_verify_nonce( $_POST['am_trail_location_nonce'], plugin_basename( __FILE__ ) ) )
      return;

  // Check permissions
  if ( 'page' == $_POST['post_type'] ) 
  {
    if ( !current_user_can( 'edit_page', $post_id ) )
        return;
  }
  else
  {
    if ( !current_user_can( 'edit_post', $post_id ) )
        return;
  }

  $location = $_POST['am_location_field'];
  $distance = $_POST['am_distance_field'];
  $difficulty = $_POST['am_difficulty_field'];  
  
update_post_meta($post_id, "am_trail_location", $location);
update_post_meta($post_id, "am_trail_distance", $distance);
update_post_meta($post_id, "am_trail_difficulty", $difficulty);
 
}





add_action( 'admin_head', 'action_magnet_trail_icon' );
function action_magnet_trail_icon() {
    ?>
    <style type="text/css" media="screen">
    #icon-edit.icon32-posts-action_magnet_trails {background: url(<?php bloginfo('template_url') ?>/images/compass.png) no-repeat;}
    </style>
<?php }
function am_claim_a_trail($trail_id,$user_id,$my_difficulty='',$my_claim_date='')
{	
if(!empty($trail_id))
 {
	$postid = $trail_id;
	$location = get_post_meta($postid,"am_trail_location",true);
	$distance = get_post_meta($postid,"am_trail_distance",true);
	$difficulty = get_post_meta($postid,"am_trail_difficulty",true); 
	$trail_title = get_the_title($postid);
	
	list($current_user_id , $this_trail_claimed_id) = explode(':',get_post_meta($postid,"am_trail_claimed_by_".$user_id,true));
	
	if(empty($current_user_id)) 
 	{
		if(!empty($my_difficulty) && !empty($my_claim_date))
		 {
			 $new_post = array(
			'post_title' => 'Claimed '.get_the_title($postid),
			'post_content' => 'Lorem ipsum dolor sit amet...',
			'post_status' => 'publish',
			'post_date' => date('Y-m-d H:i:s'),
			'post_author' => $user_id,
			'post_type' => 'claimed_trail',
			'post_category' => array(0)
			);
			$claimed_action_post_id = wp_insert_post($new_post);
			
			$user_claimed_meta_for_trail = implode(':',array($user_id,$claimed_action_post_id));
			$user_claimed_meta_for_action = implode(':',array($my_difficulty,$my_claim_date,$postid));
			
			update_post_meta($postid,"am_trail_claimed_by_".$user_id,$user_claimed_meta_for_trail );
			
			update_post_meta($claimed_action_post_id,"am_action_info_".$user_id,$user_claimed_meta_for_action);
			
			update_post_meta($claimed_action_post_id,"am_action_status_".$user_id,'incomplete');
			
			$thumbnail_url = wp_get_attachment_image_src(get_post_thumbnail_id( $postid ),'thumbnail');
			$upload_dir = wp_upload_dir();
			$picture_url = ($thumbnail_url[0])? $thumbnail_url[0]:$upload_dir['baseurl'].'/logotemp_03.jpg';
			$description = wp_trim_excerpt(get_post($postid)->post_content);
	
		if( !class_exists('Facebook') ){
		$path = $_SERVER['DOCUMENT_ROOT'];		
		require_once $path.'/wp-content/plugins/wp-fb-autoconnect/facebook-platform/php-sdk-3.1.1/facebook.php';
		if( class_exists('Facebook') ){
					$facebook = new Facebook(array('appId'=>get_option("jfb_app_id"), 'secret'=>get_option("jfb_api_sec"), 'cookie'=>true ));	
					$attributes = array('access_token' => $facebook->access_token, 
					'message' => 'Claimed '.get_the_title($postid), 
					'link' => get_permalink($claimed_action_post_id),
					'name' => get_the_title($claimed_action_post_id),
					'picture'=> $picture_url,
					'caption' => 'Going to claim this trail by '.$my_claim_date,
					'description'=>$description
							); 
					 
					 try
						{           
							$facebook->api('/me/feed/', 'post', $attributes );
						}
						catch (FacebookApiException $e)
						{
							$jfb_log .= "WARNING: Failed to publish to the user's wall (is your message too long?) (" . $e . ")\n";
						}
					}
		}	 
		$result = array('trail_id'=> $trail_id,
						'claimed_id' => $claimed_action_post_id,
						'trail_title' => $trail_title, 
						'location' => $location,
						'distance' => $distance,
						'difficulty' => $difficulty,
						'not_claimed' => false
						);
		return $result;				
		 }
		 else 
		{	
			$result = array('trail_id'=> $trail_id,
						'claimed_id' => $post_id,
						'trail_title' => $trail_title, 
						'location' => $location,
						'distance' => $distance,
						'difficulty' => $difficulty,
						'not_claimed' => true
						);
			return $result; 
		}
 	}
	else 
		{	
			list($this_trail_my_difficulty , $this_trail_my_completion_date ) = explode(':',get_post_meta($this_trail_claimed_id,"am_action_info_".$user_id,true));
			$result = array('trail_id'=> $trail_id,
						'claimed_id' => $this_trail_claimed_id,
						'trail_title' => $trail_title, 
						'location' => $location,
						'distance' => $distance,
						'difficulty' => $difficulty,
						'my_difficulty' => $this_trail_my_difficulty,
						'my_date_completion' => $this_trail_my_completion_date,
						'not_claimed' => false
						);
			return $result; 
		}
 }
else 
return false; 

}
function add_custom_image($post_id, $upload)
{
 $uploads = wp_upload_dir(); /*Get path of upload dir of wordpress*/

 if (is_writable($uploads['path']))  /*Check if upload dir is writable*/
 {
  if ((!empty($upload['tmp_name'])))  /*Check if uploaded image is not empty*/
  {
   if ($upload['tmp_name'])   /*Check if image has been uploaded in temp directory*/
   {
    $file=handle_image_upload($upload); /*Call our custom function to ACTUALLY upload the image*/

    $attachment = array  /*Create attachment for our post*/
    (
      'post_mime_type' => $file['type'],  /*Type of attachment*/
      'post_parent' => $post_id,  /*Post id*/
    );

    $aid = wp_insert_attachment($attachment, $file['file'], $post_id);  /*Insert post attachment and return the attachment id*/
    $a = wp_generate_attachment_metadata($aid, $file['file'] );  /*Generate metadata for new attacment*/
    $prev_img = get_post_meta($post_id, 'custom_image');  /*Get previously uploaded image*/
    if(is_array($prev_img))
    {
     if($prev_img[0] != '')  /*If image exists*/
     {
      wp_delete_attachment($prev_img[0]);  /*Delete previous image*/
     }
    }
    update_post_meta($post_id, 'custom_image', $aid);  /*Save the attachment id in meta data*/

    if ( !is_wp_error($aid) ) 
    {
     wp_update_attachment_metadata($aid, wp_generate_attachment_metadata($aid, $file['file'] ) );  /*If there is no error, update the metadata of the newly uploaded image*/
    }
   }
  }
  else
  {
   echo 'Please upload the image.';
  }
 }
}

function handle_image_upload($upload)
{
 global $post;

        if (file_is_displayable_image( $upload['tmp_name'] )) /*Check if image*/
        {
            /*handle the uploaded file*/
            $overrides = array('test_form' => false);
            $file=wp_handle_upload($upload, $overrides);
        }
 return $file;
}
function am_trails_tab()
{
	bp_core_new_nav_item( array( 'name' => __( 'My Trails' ), 'slug' => 'am-my-trails', 'parent_url' => $bp->loggedin_user->domain . $bp->slug . '/', 'parent_slug' => $bp->slug, 'screen_function' => 'my_trails_page', 'position' => 40 ) );

	//bp_core_new_subnav_item( array( 'name' => __( 'Claimed Trails' ), 'slug' => 'am-my-trails-sub-nav_1', 'parent_url' => $bp->loggedin_user->domain . 'am-my-trails' . '/', 'parent_slug' => 'am-my-trails','screen_function' => 'my_claimed_trails_page', 'position' => 20 ) );
	
	function my_trails_page(){
	add_action( 'bp_template_content', 'my_profile_page_function_to_show_screen_content_default' );
	bp_core_load_template( apply_filters( 'bp_core_template_plugin', 'members/single/plugins' ) );
	}
	
	function my_profile_page_function_to_show_screen_content_default() {
	global $post, $wp_query, $blog_query, $shortcode_values, $theLayout;
	 $meta_key1 = 'am_action_status_'.bp_displayed_user_id();
	 $my_query = new WP_Query(array( 'post_type' => 'claimed_trail','author'=>bp_displayed_user_id(),'meta_key' => $meta_key1, 'meta_value' => 'incomplete' ));
	//LOOP TO CHECK CLAIMED TRAILS
	echo '<h2>Cliamed Trails</h2>';
	echo '<ol>';
	$count_incomplete;
	while ($my_query->have_posts()) : $my_query->the_post();
	$claimed_trail_meta = get_post_meta(get_the_ID(),"am_action_info_".bp_displayed_user_id(),true);
	$claimed_trail_meta_data = explode(":",$claimed_trail_meta); 
	?>	 
	<li>
    <div>
	 <h4><a href="<?php the_permalink()?>"><?php echo get_the_title($claimed_trail_meta_data[2])?></a></h4><?php //Title of trail?>
     <p>Completion date: <?php echo $claimed_trail_meta_data[1]?></p><?php //Date by which to claim this trail ?>
     <p>Difficulty set: <?php echo $claimed_trail_meta_data[0]?></p><?php //Difficulty level set by user?>
     <p></p><?php //Points Earned?>
	</div>
    </li> 
	<?php 
	$count_incomplete++;
	endwhile;
	echo ($count_incomplete == 0)?'<li><h3>No Trails Claimed</h3></li>':'';
	echo '</ol>';
	//LOOP TO CHECK COMPLETED TRAILS
	echo '<h2>Completed Trails</h2>';
	$my_query = new WP_Query(array( 'post_type' => 'claimed_trail','author'=>bp_displayed_user_id(),'meta_key' => $meta_key1, 'meta_value' => 'completed' ));
	$count_complete = 0;
	echo '<ol>';
	while ($my_query->have_posts()) : $my_query->the_post();
	$claimed_trail_meta = get_post_meta(get_the_ID(),"am_action_info_".bp_displayed_user_id(),true);
	$claimed_trail_meta_data = explode(":",$claimed_trail_meta); 
	?>	 
	<li>
    <div>
	 <h4><a href="<?php the_permalink()?>"><?php echo get_the_title($claimed_trail_meta_data[2])?></a></h4><?php //Title of trail?>
     <p>Completion date: <?php echo $claimed_trail_meta_data[1]?></p><?php //Date by which to claim this trail ?>
     <p>Difficulty set: <?php echo $claimed_trail_meta_data[0]?></p><?php //Difficulty level set by user?>
     <p></p><?php //Points Earned?>
	</div>
    </li> 
	<?php 
	$count_complete++;
	endwhile;
	echo ($count_complete == 0)?'<li><h3>No Trails Completed</h3></li>':'';
	echo '</ol>';
	}
}
add_action( 'bp_setup_nav', 'am_trails_tab' );
function verify_stars($postid='0',$user_id='0')
{
echo '<div class="movie_choice">';	
if(get_post_meta($postid,"am_claim_trail_verified",true))
{	
	$array_elements = explode("%",get_post_meta($postid,"am_claim_trail_verified",true));
	if($array_elements)
	{
		foreach( $array_elements as $array_element)
		{
			list( $userid , $username ,$date_verified) = explode("**:**",$array_element);
			if($user_id == $userid){ $current_user_verified = true;
			break;}
		}
		if(!$current_user_verified && $user_id != 0)
		{	
		echo '<div id="r1" class="rate_widget">';
			for($i=1;$i<=count($array_elements);$i++)
			{
				echo '<div class="star_'.$i.' ratings_stars_disabled ratings_vote"></div>';
			}
			for($j=count($array_elements)+1;$j<=3;$j++)
			{
				echo '<div class="star_'.$j.' ratings_stars"></div>';
			}
		echo '</div>';	
		}
		else
		{
			echo '<div id="disabled_stars">';
			for($i=1;$i<=count($array_elements);$i++)
			{
				echo '<div class="star_'.$i.' ratings_stars_disabled ratings_vote"></div>';
			}
			for($j=count($array_elements)+1;$j<=3;$j++)
			{
				echo '<div class="star_'.$j.' ratings_stars_disabled"></div>';
			}
			echo '</div>';	
		}
	}
	
}
else
{
	echo '<div id="r1" class="rate_widget">';
			for($i=1;$i<=3;$i++)
			{
				echo '<div class="star_'.$i.' ratings_stars"></div>';
			}
		
	echo '</div>';	
}
echo '</div>';
}

//Adds more fields to the admin page in cube points
add_action('cp_config_form_points','addNewPointsVariables');
function addNewPointsVariables()
{
?>
			<tr valign="top">
				 <th scope="row"><label for="cp_trails_claimed_points"><?php _e('Set Points for claimed trails','cp'); ?>:</label>
				 </th>
				 <td valign="middle"><input type="text" id="cp_trails_claimed_points" name="cp_trails_claimed_points" value="<?php echo get_option('cp_trails_claimed_points'); ?>" size="30" /></td>
			</tr>
            
            <tr valign="top">
				 <th scope="row"><label for="cp_trails_completed_points"><?php _e('Set Points for completed trails','cp'); ?>:</label>
				 </th>
				 <td valign="middle"><input type="text" id="cp_trails_completed_points" name="cp_trails_completed_points" value="<?php echo get_option('cp_trails_completed_points'); ?>" size="30" /></td>
			</tr>
            
            <tr valign="top">
				 <th scope="row"><label for="cp_trails_user_invite"><?php _e('Set Points for user invites','cp'); ?>:</label>
				 </th>
				 <td valign="middle"><input type="text" id="cp_trails_user_invite" name="cp_trails_user_invite" value="<?php echo get_option('cp_trails_user_invite'); ?>" size="30" /></td>
			</tr>
            
<?php }
//Update the options with the ones provied in the addNewPointsVariables
add_action('cp_config_process','updateNewPointsInOptions');
function updateNewPointsInOptions()
{
	$trail_claimed_points = (int)$_POST['cp_trails_claimed_points'];
	$trail_completed_points =(int)$_POST['cp_trails_completed_points'];
	$trail_invite_points = (int)$_POST['cp_trails_user_invite'];
	update_option('cp_trails_claimed_points', $trail_claimed_points);
	update_option('cp_trails_completed_points', $trail_completed_points);
	update_option('cp_trails_user_invite', $trail_invite_points);
}
//Overide the default points value for posts with the one from claimed_trails
function cp_newClaimedTrail($pid) {
	$post = get_post($pid);
	$uid = $post->post_author;
	global $wpdb;
	$count = (int) $wpdb->get_var("select count(id) from `".$wpdb->base_prefix."cp` where `type`='claimed_trail' and `data`=". $pid);
	if($count==0){
		cp_points('claimed_trail', $uid, apply_filters('cp_post_points',get_option('cp_trails_claimed_points')), $pid);
	}
}		
add_action('publish_claimed_trail','cp_newClaimedTrail');

//Overide the output shown on users points table
function cp_getClaimedTrailPermalink($type='', $uid=0, $points=0, $data='')
{   
	$claimed_trail_info = get_post_meta($data,"am_action_info_".$uid,true);
	$original_trail_info = explode(":",$claimed_trail_info);
	echo __('Claimed Trail ', 'cp'). get_the_title($original_trail_info[2]). ' "<a href="'.get_permalink( $data ).'">here</a>"';
}
add_action('cp_logs_description','cp_getClaimedTrailPermalink', 0, 4);

//disbale admin bar

if (!function_exists('disableAdminBar')) {

	function disableAdminBar(){

  	//remove_action( 'admin_footer', 'wp_admin_bar_render', 1000 ); // for the admin page
    //remove_action( 'wp_footer', 'wp_admin_bar_render', 1000 ); // for the front end

    /*function remove_admin_bar_style_backend() {  // css override for the admin page
      echo '<style>body.admin-bar #wpcontent, body.admin-bar #adminmenu { padding-top: 0px !important; }</style>';
    }*/

    //add_filter('admin_head','remove_admin_bar_style_backend');

    function remove_admin_bar_style_frontend() { // css override for the frontend
      echo '<style type="text/css" media="screen">
      html { margin-top: 0px !important; }
      * html body { margin-top: 0px !important; }
      </style>';
    }

    add_filter('wp_head','remove_admin_bar_style_frontend', 99);

  }

}
add_action('init','disableAdminBar'); // New version




/*-----------------------------------------------------------------------------------*/
/* Don't add any code below here or the sky will not fall down */
/*-----------------------------------------------------------------------------------*/
?>
