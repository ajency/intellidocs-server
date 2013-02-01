Ext.define('DMTApp.controller.DmtNotificationsTabClickController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            onMenuItemTabClick:'[id=dmt-sub-tabs-panel]', //using xtype to prevent conflict
            dmtMessagesPanel:'[id=dmt-messages-list]',
            dmtNotificationsPanel:'[id=dmt-notifications-list]',
        },
        control: {
			
			onMenuItemTabClick:
			{
				activeitemchange:'dmtNotificationTabClicked',
			},
			dmtMessagesPanel:
			{
				refresh:'dmtmessagepanelstoreloaded',
			}
            
        }
    },
    dmtmessagepanelstoreloaded : function(list)
    {
    	list.unmask();	
    },
    dmtNotificationTabClicked:function(container,new_panel,old_panel)
    {
    	   new_panel_id = (new_panel.id)?new_panel.id:'';
           
           if(new_panel_id == 'dmt-main-tab')
           {
        	   global_root_view = false;
           }
           else
           {
        	   global_root_view = true;
           }
           
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
           
           
           if(new_panel_id == 'dmt-notifications-list')
           {
        	   console.log('Notification Tab');
           
        	   var notifications_detail_panel = Ext.create('DMTApp.view.DmtTabsPanel.DmtDetailsPanel.DmtNotificationsDetailPanel');
        	   details_container.add([notifications_detail_panel]).show();
           }
           
           if(new_panel_id == 'dmt-messages-list')
           {
        	   console.log('Messages Tab');
        	   console.log(this.getDmtMessagesPanel().getId());
        	   
        	   this.getDmtMessagesPanel().mask({xtype:'loadmask',message:'Loading Messages...'});
        	   var  messages_store = this.getDmtMessagesPanel().getStore();
        	   messages_store.setProxy({	
        		   url: global_https + '/wp-content/plugins/aj-file-manager-system/includes/ajax_messages.php',
        		   extraParams:{ 
        			   dmt_user_name:this.dmtGetUsernameFromCache()
        		   },
        		   type:'jsonp',
        		   reader:{
        			   type:'json',
        			   rootProperty:'data'
        		   }
        	   });
        	   messages_store.load();
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