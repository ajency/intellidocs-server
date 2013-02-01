Ext.define('DMTApp.model.DmtForgotPasswordModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'user_name', type: 'string'}
        ],
		validations: [
            {type: 'presence',  field: 'user_name', message:'Username or email id must be provided'},
        ]
    }
});