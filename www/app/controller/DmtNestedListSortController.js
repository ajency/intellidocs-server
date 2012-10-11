Ext.define('DMTApp.controller.DmtNestedListSortController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            dmtNestedListSortByName:'button[action=dmtNestedListSortByName]',
			dmtNestedListSortByType:'button[action=dmtNestedListSortByType]',
        },
        control: {
			
			dmtNestedListSortByName :
			{
				tap:'dmtNestedListSortByNameTap'
			},
			dmtNestedListSortByType :
			{
				tap:'dmtNestedListSortByTypeTap'
			}
            
        }
    },
	//When the sort by name button is tapped
    dmtNestedListSortByNameTap:function(button)
	{
		this.dmtNestedListSortByType('f_name',button);
	},
	//When the sort by type button is tapped
	dmtNestedListSortByTypeTap:function(button)
	{
		this.dmtNestedListSortByType('f_ext',button);
	},
	//Generic sort operation by sort variable provided
	dmtNestedListSortByType:function(sort_variable,button)
	{
		var nested_list_store = Ext.getCmp('dmt-nested-list').getStore();
		if(button.getIconCls() == 'arrow_up')
		{
			nested_list_store.setSorters([{property:'f_type',direction:'DESC'},{property:sort_variable,direction:'ASC'}]);
			button.setIconCls('arrow_down');
		}
		else
		{
			nested_list_store.setSorters([{property:'f_type',direction:'DESC'},{property:sort_variable,direction:'DESC'}]);
			button.setIconCls('arrow_up');
		}
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});