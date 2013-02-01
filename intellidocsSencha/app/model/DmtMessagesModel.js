Ext.define('DMTApp.model.DmtMessagesModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
		
            {name: 'data', type: 'auto'},     
			{name: 'message_id', type: 'int'},
			{name: 'message_title', type: 'string'},
            {name: 'message_content', type: 'string'},
			{name: 'message_excerpt', type: 'string'},
			{name: 'message_date', type: 'string'},
			{name: 'message_sort', type: 'string'},
        ]
    }
});