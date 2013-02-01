Ext.define("DMTApp.store.DmtNotificationsStore", {
	extend: "Ext.data.Store",
    config: {
		
        model: 'DMTApp.model.DmtNotificationsModel',
		grouper:function(record)
				{ 
					return '<span class="dmtGrouperTitle"><span class="dmtGrouperTitleImage"></span><span class="dmtGrouperTitleText">'+ record.getData().category_name +'</span></span>';
				},
		sorters:'category_name'		
	}

});