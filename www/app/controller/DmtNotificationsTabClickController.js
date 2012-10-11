Ext.define('DMTApp.controller.DmtNotificationsTabClickController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            onMenuItemTabClick:'.dmtsubtabspanel' //using xtype to prevent conflict
        },
        control: {
			
			onMenuItemTabClick:
			{
				activeitemchange:'dmtNotificationTabClicked',
			}
            
        }
    },
    dmtNotificationTabClicked:function(container,new_panel,old_panel)
    {
           console.log('Tab Item Changed')
           
           var details_container = Ext.getCmp('dmt-details-container');
           var details_container_titlebar = Ext.getCmp('dmt-details-container-titlebar');
           
           if( Ext.getCmp('dmt-change-password-panel'))
           {
           Ext.getCmp('dmt-change-password-panel').destroy();
           Ext.getCmp('dmt-settings-panel-change-password').reset();
           }
           
           if(Ext.getCmp('dmt-details-view-card'))
           Ext.getCmp('dmt-details-view-card').destroy();
           
           if(Ext.getCmp('dmt-notifications-details-panel'))
           Ext.getCmp('dmt-notifications-details-panel').destroy();
           
           if(Ext.getCmp('dmt-messages-details-panel'))
           Ext.getCmp('dmt-messages-details-panel').destroy();
           
                    
           //fix the removal of the details panel and change the title bar.
            
           var details_container_titlebar = Ext.getCmp('dmt-details-container-titlebar');	
           details_container_titlebar.setTitle('Details Panel');
           //End fix
           
           
           if(new_panel.getId() == 'dmt-notifications-list')
           {
           console.log('Notification Tab');
           
           var notifications_detail_panel = Ext.create('DMTApp.view.DmtTabsPanel.DmtDetailsPanel.DmtNotificationsDetailPanel');
           details_container.add([notifications_detail_panel]).show({type:'pop',duration:500,easing:'ease-out'});
           }
           
           if(new_panel.getId() == 'dmt-messages-list')
           {
           messages_store = Ext.getCmp('dmt-messages-list').getStore();
           messages_store.setProxy({	
                                   url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_messages.php',
                                   extraParams:{dmt_user_name:this.dmtGetUsernameFromCache()},
                                   type:'jsonp',
                                   reader:
                                   {
                                   type:'json',
                                   rootProperty:'data'
                                   }
                                   });
           
           messages_store.load();
           console.log('Messages Tab');
        }
    },
    dmtGetUsernameFromCache:function()
    {
        var login_info_store = Ext.getStore('DmtLocalStorageCookie');
        login_info_store.load();
        var index = login_info_store.find('key','dmtScLgInfo');
        if(index == -1)
           return '';
        else
        {
           var record = login_info_store.getAt(index);
           var stored_data = record.getData();
           return stored_data.user_name; 
        }
    },    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});