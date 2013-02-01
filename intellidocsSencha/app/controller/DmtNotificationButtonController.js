Ext.define('DMTApp.controller.DmtNotificationButtonController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            dmtNotificationButton:'button[action=dmtNotificationButtonTap]',
        },
        control: {
            dmtNotificationButton:
			{
				tap:'dmtNotificationButtonTap',
			}
        }
    },
    dmtNotificationButtonTap:function(button)
	{
		button.setBadgeText('');
		
		if(Ext.getCmp('dmt-settings-logout-action'))
			Ext.getCmp('dmt-settings-logout-action').destroy();
		
		Ext.Viewport.add({
			id:'dmt-settings-logout-action',	
			xtype:'panel',
			modal: true,
			right:0,
			hideOnMaskTap:true,
			styleHtmlContent:true,
			width:300,
		}).showBy(button);
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});