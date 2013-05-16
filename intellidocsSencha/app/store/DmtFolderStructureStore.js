Ext.define("DMTApp.store.DmtFolderStructureStore", {
	extend: "Ext.data.TreeStore",
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
            //url: root_file_path + '/dir_list.js',
            type:'memory',
            reader:
            {
                type:'json',
                rootProperty:'items'
            },			
        },
		listeners:
		{
           beforeload:function(store)
           {
            var _this = this;
            
            /** check for intial launch and trigger write json */
            /**if((global_init_launch || global_is_user_logged_in) && navigator.onLine)
            {
            	global_is_user_logged_in = global_init_launch = false;
            	console.log("This is initial launch write json");
                IntelliDocs.write_json(true,_this.dmtGetUsernameFromCache());
                Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});
            }
            else
            {*/
            	/*check if dir_list.js exists. may be false so change to online store and write dir_list.js now */
            	fileSystemRoot.getFile(root_file_path+"/dir_list.js",
                                  {},
                                  function(fileEntry){
                                	  console.log("File exists");
                                      console.log("Offline Store"); 
                                       	var reader = new FileReader();
                                		reader.onloadend = function(evt) {
                                	       
                                	        store.setProxy({data:evt.target.result});
                                	        Ext.getCmp('dmt-nested-list').unmask();
                                	    };
                                	    reader.readAsText(fileEntry);
                                 
                                   },
                                   function(err){
                                    //if file doesn't exists
                                    console.log("File not present");
                                    console.log("Online Store");
                                    if(Ext.device.Connection.isOnline())
                                    {
                                        IntelliDocs.write_json(true,_this.dmtGetUsernameFromCache());
                                        Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});
                                   }
                                   else
                                   {
                                        Ext.Msg.alert('','You are currently offline.');
                                   }
                    });
            }
		}
	},
	//Run the ajax request to delete items from the server
	dmtRemoveNotificationsFromServer:function()
	{
           console.log('username:' + this.dmtGetUsernameFromCache());
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