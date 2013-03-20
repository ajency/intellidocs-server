<?php 
//Remove view from post row actions
function dmt_remove_row_actions( $actions, $post )
{
  	global $current_screen;
	
	if( $current_screen->post_type != 'document_files' ) return $actions;
		unset( $actions['view'] );
	return $actions;
}
add_filter( 'post_row_actions', 'dmt_remove_row_actions', 10, 2 );


//Function to output javascript to hide unnessary quick edit fields
function dmt_hide_unnessary_quick_edit_fields_js() 
{    
    /**
       /wp-admin/edit.php?post_type=post
       /wp-admin/edit.php?post_type=page
       /wp-admin/edit.php?post_type=cpt  == document_files in this example
     */

    global $current_screen;
    if( 'edit-document_files' != $current_screen->id )
        return;
    ?>
    <script type="text/javascript">         
        jQuery(document).ready( function($) {
            $('span:contains("Slug")').each(function (i) {
                $(this).parent().remove();
            });
            $('span:contains("Password")').each(function (i) {
                $(this).parent().parent().remove();
            });
            $('span:contains("Date")').each(function (i) {
                $(this).parent().remove();
            });
            $('.inline-edit-date').each(function (i) {
                $(this).remove();
            });
        });    
    </script>
    <?php
}
add_action( 'admin_head-edit.php', 'dmt_hide_unnessary_quick_edit_fields_js' );

//Expand Quick edit to have Solcitor Name, Item ID and Description
function dmt_add_quick_edit($column_name, $post_type) {
	if ($column_name != 'document_solicitor') return;
	?>
    <style>
	.dmtQuickEditItemValue{ vertical-align:middle;}
	textarea.dmtQuickEditItemValue{ width:100%; resize:vertical;}
	input.dmtQuickEditItemValue{margin-left: 10px;}
	</style>
    <fieldset class="inline-edit-col-left">
    <?php  wp_nonce_field( plugin_basename( __FILE__ ), 'dmt_custom_file_meta' );?>
	<div class="inline-edit-col">
		<span class="title">Solicitor</span>
		<input type="text" name="dmt_name_of_solicitor" id="dmt_name_of_solicitor" class="dmtQuickEditItemValue" value="" size="30" />
	</div>
    <div class="inline-edit-col">
		<span class="title">Item ID</span>
		<input type="text" name="dmt_item_number" id="dmt_item_number"  class="dmtQuickEditItemValue" value="" size="30" />
	</div>
    <div class="inline-edit-col">
		<span class="title">Description</span>
		<textarea rows="4" name="dmt_file_desc" id="dmt_file_desc" class="dmtQuickEditItemValue">&nbsp;</textarea>
	</div>
    </fieldset>
	<?php
}
add_action('quick_edit_custom_box',  'dmt_add_quick_edit', 10, 2);

//Function to populate the quick edit items with new values. 
function dmt_expand_quick_edit_link($actions, $post) {
	global $current_screen,$wpdb;
	if (($current_screen->id != 'edit-document_files') || ($current_screen->post_type != 'document_files')) return $actions; 
	
	$nonce 		= wp_create_nonce( 'dmt_custom_file_meta'.$post->ID);
	$solicitor 	= get_post_meta( $post->ID, 'dmt_file_solicitor', true);
	$item_id 	= get_post_meta( $post->ID, 'dmt_file_item_number', true);	
	$desc		= $wpdb->get_var($wpdb->prepare("SELECT `post_excerpt` FROM $wpdb->posts WHERE `ID` = %d",$post->ID));
	$meta_value = json_encode(array('solicitor' => $solicitor ,'item_id' => $item_id,'desc' => $desc));
	
	$actions['inline hide-if-no-js'] = '<a href="#" class="editinline" title="';
	$actions['inline hide-if-no-js'] .= esc_attr( __( 'Edit this item inline' ) ) . '" ';
	$actions['inline hide-if-no-js'] .= ' onclick=\'set_inline_widget_set('.$meta_value.', "{$nonce}")\'>'; 
	$actions['inline hide-if-no-js'] .= __( 'Quick&nbsp;Edit' );
	$actions['inline hide-if-no-js'] .= '</a>';
	return $actions;	
}
add_filter('post_row_actions', 'dmt_expand_quick_edit_link', 10, 2);

//Display the new values of the meta fields when Quick edit is clicked.
function dmt_quick_edit_javascript() {
	global $current_screen;
	if (($current_screen->id != 'edit-document_files') || ($current_screen->post_type != 'document_files')) return; 
 
	?>
	<script type="text/javascript">
	<!--
	function set_inline_widget_set(meta_values, nonce) {
		// revert Quick Edit menu so that it refreshes properly
		inlineEditPost.revert();
		jQuery('#dmt_name_of_solicitor').val(meta_values.solicitor);
		jQuery('#dmt_item_number').val(meta_values.item_id);
		jQuery('#dmt_file_desc').html(meta_values.desc);
		jQuery('#dmt_custom_file_meta').val(nonce);
		
	}
	//-->
	</script>
	<?php
}
add_action('admin_footer', 'dmt_quick_edit_javascript');

?>