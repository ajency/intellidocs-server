Ext.define('DMTApp.model.DmtLoginFormModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'user_name', type: 'string'},
            {name: 'password', type: 'string'}
        ],
		 validations: [
            {type: 'presence',  field: 'user_name', message:'Username must be provided'},
			{type: 'presence',  field: 'password',  message:'Password must be provided'},
        ]
    }
});