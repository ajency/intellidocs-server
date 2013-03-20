<?php
/**
 * Function to do a redirect if a template is going to be loaded.
 */
function dmt_template_redirect()
{
	$page_ids = array('33','29');
	foreach($page_ids as $id)
	{
		if(isset($_GET['page_id']) && $_GET['page_id'] == $id)
		{
			$allow_page = true;
		}
	}
	if(!$allow_page)
	{
		wp_redirect(home_url().'/wp-admin/' );
		exit;
	}
}
add_action('template_redirect','dmt_template_redirect');

/**
 * Function to add changes to login form 
 * CSS added by Jarryd
 */
function dmt_login_stylesheet() { ?>
<link
	rel="stylesheet" id="custom_wp_admin_css"
	href="<?php echo WP_PLUGIN_URL.'/aj-file-manager-system/css/style.css' ?>"
	type="text/css" media="all" />
<?php }
add_action( 'login_enqueue_scripts', 'dmt_login_stylesheet' );

/**
 * Functions copied from aj_logo_login plugin
 */

//Company URL goes here
function aj_login_url_filter($new_url)
{

	$new_url =  get_option('aj_in_company_url');
	if(empty($new_url))
	{
		$new_url="http://www.ajency.in";
		return $new_url;
	}
	return $new_url;
}
add_filter('login_headerurl', 'aj_login_url_filter');


//Title field goes here
function aj_login_title_filter($new_title)
{
	$new_title = get_option('aj_in_company_title');
	if(empty($new_title))
	{
		$new_title = 'This site was developed by Ajency.in';
		return $new_title;
	}
	return $new_title;
}
add_filter('login_headertitle', 'aj_login_title_filter');

//Company Logo URL goes here.
function aj_login_image_filter()
{
$newlogo = get_option('aj_in_company_image_url');
$style = '<style type="text/css"> .login h1 a '; 
 if(empty($newlogo))
 {
	$style .=  '{background: url('. WP_PLUGIN_URL.'/aj-file-manager-system/img/new_logo_1.png'.') no-repeat scroll center top transparent !important ;}';
 }
  else 
  {
	$style .= '{background: url('.$newlogo.') no-repeat scroll center top transparent;}';
  }
$style .= '</style>';

echo $style;
}
add_action('login_enqueue_scripts', 'aj_login_image_filter');


//Registering all the options on admin_init
function aj_in_login_dashboard_admin_init()
{
register_setting('aj_in_login_dashboard', 'aj_in_company_url');
register_setting('aj_in_login_dashboard', 'aj_in_company_title');
register_setting('aj_in_login_dashboard', 'aj_in_company_image_url');
register_setting('aj_in_login_dashboard', 'aj_in_company_fb_like_page');

}
add_action('admin_init','aj_in_login_dashboard_admin_init');

//Displaying the actual settings page.
function aj_in_login_dashboard_admin()
{?>
<div class="wrap">
<?php screen_icon();?>
<h2>Ajency Login Preferences</h2>
<h3>Please enter the settings for your login page</h3>

<form action="options.php" method="post" id="aj_in_login_page_form">
<?php // Very Important to handle nonces.?>
<?php settings_fields('aj_in_login_dashboard');?>

<table class="widefat importers">
			<tbody>
				<tr class="alternate">
					<td class="import-system row-title"><label for="aj_in_company_url">Enter the URL of your company site:</label></td>
					<td class="desc">
						<input type="text" id="aj_in_company_url" name="aj_in_company_url" value="<?php echo esc_url(get_option('aj_in_company_url'))?>" size="80"/><br>
						<span class="description">The website of the company the logo should point to.</span>
					</td>
				</tr>
				<tr class="alternate">
					<td class="import-system row-title"><label for="aj_in_company_title">Enter a "Title" for the company logo:</label></td>
					<td class="desc">
						<input type="text" id="aj_in_company_title" name="aj_in_company_title" value="<?php echo esc_attr(get_option('aj_in_company_title'))?>" size="80" /><br>
						<span class="description">The text that should appear over the logo on mouse hover.</span>
					</td>
				</tr>
				<tr class="alternate">
					<td class="import-system row-title"><label for="aj_in_company_image_url">Enter the URL of your company logo:</label></td>
					<td class="desc">
						<input type="text" id="aj_in_company_image_url" name="aj_in_company_image_url" value="<?php echo esc_url(get_option('aj_in_company_image_url'))?>" size="80" /><br>
						<span class="description">The URL of the logo that should appear on the login page.</span>
					</td>
				</tr>	
			</tbody>
</table>
<p><input type="submit" name="submit" value="Save Settings" class="button-secondary"></p>	
</form>
</div>

<?php }

function aj_in_dashboard_register()
{
add_options_page('Ajency.in Dashboard', 'Custom Login icon', 'manage_options', 'aj-in-dashboard-plugin','aj_in_login_dashboard_admin');
}

add_action('admin_menu','aj_in_dashboard_register');



