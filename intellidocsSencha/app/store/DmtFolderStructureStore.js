Ext.define("DMTApp.store.DmtFolderStructureStore", {
	extend: "Ext.data.Store",
	requires:['Ext.data.proxy.Memory'],
    name: 'nisheed',
    config: {
		autoLoad:false,
        model: 'DMTApp.model.DmtFolderStructureModel',
        sorters:
        [
         {property:'f_type',direction:'DESC'},
         {property:'fld_item_id',direction:'ASC'},
         {sorterFn:function(record1,record2){
         
	         var  item1 = record1.data.f_item_id,
	         item2 = record2.data.f_item_id;
	         
	         item1 = (!item1)? 999999999 : item1;
	         item2 = (!item2)? 999999999 : item2;
	         
	         return item1 < item2 ? 1 : (item1 == item2 ? 0 : -1);
	         
         },direction:'DESC'},			
         {property:'f_name',direction:'ASC'}	        
        ],
		proxy:{
            type:'memory',
            reader:
            {
                type:'json',
                rootProperty:'items'
            },			
        }
	},
	//Run the ajax request to delete items from the server
	dmtRemoveNotificationsFromServer:function()
	{
           Ext.data.JsonP.request({
            url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_notification_uodate.php',
			callbackKey: 'dmt_delete_notifications',
            params: {dmt_user_name: this.dmtGetUsernameFromCache()},
            success: function(result, request) 
			{
                // Unmask the viewport
                Ext.Viewport.unmask();
				if(result.response == true)
				{
					console.log('Removed Notifications');
					var notifications_tab = Ext.getCmp('dmt-notifications-list');
					notifications_tab.tab.setBadgeText('');
					notifications_tab.getStore().setData([]).load();
				}
				else
					console.log('Failed To Remove Notifications');
            },
            failure:function(e)
			{
				// Unmask the viewport
                Ext.Viewport.unmask();
				console.log(e);
			}
        });
	},
	//Get the user name to be sent to the ajax function 
	dmtGetUsernameFromCache:function()
	{
		var login_info_store = Ext.getStore('DmtLocalStorageCookie');
		login_info_store.load();
		var index = login_info_store.find('key','dmtScLgInfo');
		if(index == -1)
        {
           console.log('nothing found');
           return '';
        }
        else
		{
           var record = login_info_store.getAt(index);
		   var stored_data = record.getData();
           console.log('uname:'+stored_data.user_name);
           return stored_data.user_name; 
		}
	}
});