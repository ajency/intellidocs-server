Ext.define('DMTApp.controller.DmtMainViewPortController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: 
		{
			dmtMainContainer:'#dmt-main-container',
        },
        control: 
		{
			dmtMainContainer:
			{
				initialize:'dmtMainContainerInitialize'
			}
        }
    },
	dmtMainContainerInitialize:function(main_container)
	{
		if(!this.dmtMainContainerLoginCheck())
		{
			var dmt_secure_login_panel = Ext.create('DMTApp.view.DmtSecureLogin');
			main_container.setActiveItem(dmt_secure_login_panel);
		}
		else
		{
			var tabs_panel = Ext.create('DMTApp.view.DmtTabsPanel');
			main_container.setActiveItem(tabs_panel);
		}
	},
	dmtMainContainerLoginCheck:function()
	{
		var login_info_store = Ext.getStore('DmtLocalStorageCookie');
		login_info_store.load();
		var index = login_info_store.find('key','dmtScLgInfo');
		console.log(index);
		if(index == -1)
			return false;
		else
		{
			var record = login_info_store.getAt(index);
			var stored_data = record.getData(); 
			if(stored_data.value == 'loggedInSuccessfully')
				return true;
			else
				return false	
		}
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});