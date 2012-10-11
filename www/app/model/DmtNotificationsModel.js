Ext.define('DMTApp.model.DmtNotificationsModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
		
			{name: 'post_id', type: 'auto'},
			{name: 'notification_id', type: 'auto'},
            {name: 'file_name', type: 'auto'},
			{name: 'category_id', type: 'auto'},
			{name: 'category_name', type: 'auto'},
			{name: 'notify_message', type: 'auto'},
			{name: 'folder', type: 'auto'},
        ]
    }
});