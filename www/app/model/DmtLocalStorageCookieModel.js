Ext.define('DMTApp.model.DmtLocalStorageCookieModel', {
    extend: 'Ext.data.Model',     
	requires:['Ext.data.identifier.Uuid'],
    config: {
		identifier: 'uuid',
        fields: [
            {name: 'id', type: 'auto'},
            {name: 'key', type: 'auto'},
            {name: 'value', type: 'auto'},
            {name: 'user_name', type: 'auto'},
			{name: 'user_email', type: 'auto'}
        ],
		proxy: {
            type: 'localstorage',
            id  : 'com.dmt.login',
        },	
	}
    
});