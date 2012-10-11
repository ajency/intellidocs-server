Ext.define('DMTApp.model.DmtMessagesModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
		
			{name: 'message_id', type: 'int'},
			{name: 'message_title', type: 'auto'},
            {name: 'message_content', type: 'auto'},
			{name: 'message_excerpt', type: 'auto'},
			{name: 'message_date', type: 'auto'},
			{name: 'message_sort', type: 'string'},
        ]
    }
});