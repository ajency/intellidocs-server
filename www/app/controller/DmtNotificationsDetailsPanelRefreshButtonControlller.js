Ext.define('DMTApp.controller.DmtNotificationsDetailsPanelRefreshButtonControlller', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            notificationRefreshButton:'button[action=dmtNotificationsDetailsPanelRefresh]'
        },
        control: {
            notificationRefreshButton:
			{
				tap:'dmtNotificationRefreshButtonTap'
			}
        }
    },
    dmtNotificationRefreshButtonTap:function(button)
	{
        if(navigator.onLine)
        {
            var sub_tabs_panel = Ext.getCmp('dmt-sub-tabs-panel');
            sub_tabs_panel.setActiveItem(0);
		
		    
            var nested_list_store = Ext.getCmp('dmt-nested-list').getStore();
            nested_list_store.setSorters([
                                         {property:'fld_item_id',direction:'ASC'},
                                         {property:'f_type',direction:'DESC'},  
                                         {sorterFn:function(record1,record2){
                                         
                                         var  item1 = record1.data.f_item_id,
                                         item2 = record2.data.f_item_id;
                                         
                                         item1 = (!item1)? 999999999 : item1;
                                         item2 = (!item2)? 999999999 : item2;
                                         
                                         return item1 < item2 ? 1 : (item1 == item2 ? 0 : -1);
                                         
                                         },direction:'DESC'},			
                                         {property:'f_name',direction:'ASC'},]);
            Ext.getCmp('dmt-nested-list-sort-by-name').setIconCls('arrow_down');
            Ext.getCmp('dmt-nested-list-sort-by-type').setIconCls('arrow_down');
            Ext.getCmp('dmt-nested-list-sort-by-item-id').setIconCls('arrow_down');
        
            IntelliDocs.write_json(true,this.dmtGetUsernameFromCache(),false);
            Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});
            Ext.getCmp('dmt-nested-list-refresh-button').removeCls('dmtRefreshToRemoveNotifications');
        }
        else
        {
           Ext.Msg.alert('','You are currently offline.');
        }
       		
    },
    //Get the user name to be sent to the ajax function 
    dmtGetUsernameFromCache:function()
    {
           var login_info_store = Ext.getStore('DmtLocalStorageCookie');
           login_info_store.load();
           var index = login_info_store.find('key','dmtScLgInfo');
           if(index == -1)
           {
           return '';
           }
           else
           {
           
           var record = login_info_store.getAt(index);
           var stored_data = record.getData();
           return stored_data.user_name; 
           }
    },
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});