
jQuery(document).ready(function()
		{
			jQuery('h3').each(function (){
				
				if(jQuery(this).html() == 'Personal Options')
					{
						jQuery(this).next('table').remove();
						jQuery(this).remove();
					}
				
				if(jQuery(this).html() == 'Name')
				{
					$temp_table = jQuery(this).next('table');
					for(var i = 0;i<=2;i++)
					{
						jQuery($temp_table).find('tr:nth-child(4)').remove();
					}

				}
				
				if(jQuery(this).html() == 'Contact Info')
				{
					$temp_table = jQuery(this).next('table');
					
					for(var i = 0;i<=3;i++)
						{
							jQuery($temp_table).find('tr:nth-child(2)').remove();
						}
				}
				
				if(jQuery(this).html() == 'About Yourself' || jQuery(this).html() == 'About the user')
				{
					$temp_table = jQuery(this).next('table');
					
						jQuery($temp_table).find('tr:nth-child(1)').remove();
				}
				
			});
			
			
		});
