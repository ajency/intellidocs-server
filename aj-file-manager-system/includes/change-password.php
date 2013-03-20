<div class="wrap">
<div id="icon-edit" class="icon32" ></div>
<h2>Change Password</h2>
<div class="updated below-h2" id="message"  >

</div>
</div>
<form>   
   <table border="0" width="100%" title="Change Password" class="wp-list-table"  >  
     
	<tr>  
		<td colspan="2"><div id="message" ></div></td> 
	</tr>		
	<tr>  
        <td width="150"><label>Password (twice, required)</label></td>
		<td><div> <input type="password" name="user_pass1" id="user_pass1"></div>
		</td> 
	</tr>	
	<tr>  
        <td ><strong> </strong></td>
		<td><div> <input type="password" name="user_pass2" id="user_pass2"></div>
		</td> 
	</tr>
    <tr>
		<td colspan="2" >
		<input type="hidden" id="page-redirect" value="<?php echo site_url().'/wp-login.php';?>">
			<div id="btn-change-password" ><input id="update-user-password" type="button" value="Submit" class="button button-primary">
			 </div>
		</td>    	  
     </tr>
</table>
</form>
	<div id="processing-img" style="display:none"><img src="<?php echo WP_PLUGIN_URL. '/aj-file-manager-system/img/loading.gif';?>"></div> 