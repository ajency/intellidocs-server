Ext.define('DMTApp.model.ChangePasswordFormModel', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: 'old_password', type: 'string'},
            {name: 'new_password', type: 'string'},
            {name: 'cnf_new_password', type: 'string'}
        ],
		validations: [
			{ type: 'presence',  field: 'old_password' , message:'Previous password must be specified'},
			{ type: 'presence',  field: 'new_password' , message:'New password must be specified'},
			{ type: 'presence',  field: 'cnf_new_password' , message:'New password must be confirmed again'},

        ],
    }
});