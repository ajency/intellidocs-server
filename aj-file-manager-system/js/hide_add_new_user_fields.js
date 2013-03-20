jQuery(document).ready(function()
		{
			
			jQuery('.form-table').find('tr:nth-child(5)').remove();
			var info_text = 'You can set the folder access for the user once the user has been added';
			jQuery('.form-table').find('tr').last().after('<tr class="form-field"><th scope="row"></th><td><span class="description">'+info_text+'</span></td></tr>');

		});