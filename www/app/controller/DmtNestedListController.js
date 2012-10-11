var current_f_id; 


Ext.define('DMTApp.controller.DmtNestedListController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			 //Referencing the nested list by its xtype
            dmtNestedList			  :'.dmtnestedfolderlist',
			 //Used the button action to prevent conflict on reinitialization.
			dmtNestedListRefreshButton:'button[action=dmtNestedListRefreshButton]'
        },
        control: {
            dmtNestedList:
			{
				itemtap		:'dmtNestedListItemTap',
				leafitemtap	:'dmtNestedListLeafItemTap',
				back		:'dmtNestedListBackTap',
				initialize	:'dmtNestedListInitialize',
				load 		:'dmtNestedListLoad'
			},
			dmtNestedListRefreshButton:
			{
				tap			:'dmtNestedListRefreshButton',		
			}
        }
    },
	dmtDetailsPanelChange:function(record,deafult_panel,file_exists)
	{
        var buttonText = (file_exists) ? "Open" : "Download File";
        var buttonAction = (file_exists) ? "dmtDetailsPanelOpenButton" : "dmtDetailsPanelDownloadButton";		
		var panel_content = {};
		
		if(!deafult_panel)
			var record_data = record.getData();
		else
			var record_data = deafult_panel;
		
		var f_ext = (record_data.f_ext)?record_data.f_ext.replace('.',''):'';
		var details_container = Ext.getCmp('dmt-details-container');
		var details_container_titlebar = Ext.getCmp('dmt-details-container-titlebar');		
		
       
           //NEW CHANGES 
           var description = (record_data.f_description == "")?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Description: </span>'+record_data.f_description+'</p>';
           var solicitor 	= (record_data.f_solicitor == "")?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Solicitor: </span>'+record_data.f_solicitor+'</p>';
           var item_id 	= (record_data.f_item_id == null)?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Item Id: </span>'+record_data.f_item_id+'</p>';
           
           switch (record_data.f_type)
           {
           case 'file':
           console.log(record_data.f_type);
           panel_content = {
           id:'dmt-details-view-card',
           cls:'dmtDetailsViewPanel',
           scrollable:true,
           layout:
           {
           type:'vbox',
           pack:'center',
           align:'left',
           },
           items:[
                  {
                  styleHtmlContent:true,
                  html:
                  [
                   '<div class="dmt-file-icon-big dmt-file-icon-desc dmt-file-'+ f_ext +'-large"></div>' +
                   '<div class="dmt-file-meta-desc"><p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Name:</span>'+record_data.f_name+'</p>' +
                   '<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Type:</span>'+record_data.f_ext+'</p>' +
                   solicitor+ item_id + description +
                   '</div>'
                   ],
                  items:
                  [	
                   {
                   xtype: 'hiddenfield',
                   name: 'document_url',
                   id:'dmtFileUrl',
                   value: record_data.f_attachment
                   
                   },
                   {
                   xtype: 'hiddenfield',
                   name: 'document_folder',
                   id:'dmtFileFolder',
                   value: record_data.f_folder
                   
                   },{
                   xtype: 'hiddenfield',
                   name: 'document_folder_id',
                   id:'dmtFileFolder_id',
                   value: record_data.f_id
                   
                   },]
                  },
                  {	
                  style:'margin-left:65px;margin-top:20px;',
                  xtype:'button',
                  id : 'dmt-file-action-button',
                  text:buttonText,
                  cls:'dmt-details-panel-download-button',
                  ui:'confirm round',
                  iconCls:'download',
                  iconMask:true,
                  iconAlign:'right',
                  width:150,
                  height:32,
                  action:buttonAction,
                  }	
                  ]
           }  
           
           if(file_exists)
           {
                panel_content.items.push({style:'margin-left:65px;margin-top:20px;',
                                    xtype:'button',
                                    text:"Delete File",
                                    cls:'dmt-details-panel-download-button',
                                    ui:'round',
                                    iconCls:'delete',
                                    iconMask:true,
                                    iconAlign:'right',
                                    width:150,
                                    height:32,
                                    action:"dmtDetailsPanelDeleteButton",});
           }
           
           break
           //END NEW CHANGES	
           case 'folder':
           
            
           panel_content = {
           layout:
           {
           type:'vbox',
           pack:'center',
           align:'center',
           },
           id:'dmt-details-view-card',
           cls:'dmtDetailsViewPanel',
           scrollable:true,
           styleHtmlContent:true,
           items:
           [
            {   html:'<div class="dmt-file-icon-big dmt-file-'+ f_ext +'-large"></div>'},
            
            {   html:'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Name:</span>'+record_data.f_name+'</p>'},
            
            {
                xtype: 'hiddenfield',
                name: 'document_folder_id',
                id:'dmtFileFolderId',
                value: record_data.f_id,
            
            },
            {
                xtype: 'hiddenfield',
                name: 'document_folder_path',
                id:'dmtFileFolderPath',
                value: record_data.f_folder,
            
            },
            {
                xtype: 'hiddenfield',
                name: 'document_folder_count',
                id:'dmtFileFolder_count',
                value: record_data.f_file_count,
            
            },
            {
                html : '<p></p>',
                id : 'dmt-folder-metadata' 
            },
            
            ]
           }
           if(record_data.f_file_count > 0)
           {
           panel_content.items.push({ 
                                    xtype:'button',
                                    text:'Download all files in folder',
                                    cls:'dmt-details-panel-folder-download-button',
                                    ui:'confirm round',
                                    iconCls:'download',
                                    iconMask:true,
                                    iconAlign:'right',
                                    width:250,
                                    height:32,
                                    style:'margin-top:20px',
                                    action:'dmtDetailsPanelFolderDownloadButton',
                                    });
           }
           
           panel_content.items.push({	
                                    xtype:'button',
                                    text:'Download Files In Sub Folder',
                                    cls:'dmt-details-panel-folder-download-button',
                                    ui:'confirm round',
                                    iconCls:'download',
                                    iconMask:true,
                                    iconAlign:'right',
                                    width:250,
                                    height:32,
                                    style:'margin-top:20px',
                                    action:'dmtDetailsPanelSubFolderDownloadButton',
                                    });
           
           if(record_data.f_file_count > 0)
           {
           panel_content.items.push({ 
                                    xtype:'button',
                                    text:'Delete Files In Folder',
                                    cls:'dmt-details-panel-folder-download-button',
                                    ui:'round',
                                    iconCls:'delete',
                                    iconMask:true,
                                    iconAlign:'right',
                                    width:250,
                                    height:32,
                                    style:'margin-top:20px',
                                    action:'dmtDetailsPanelFolderDeleteFilesButton',
                                    });
           }           
           IntelliDocs.getFolderMeta(record_data.f_folder,record_data.f_file_count)
           break;
           default:
				panel_content = null;		
		}
	
		
		if(Ext.getCmp('dmt-details-view-card'))
				Ext.getCmp('dmt-details-view-card').destroy();
		
		if(panel_content)
		{		
			var new_details_panel = Ext.create('Ext.Panel',panel_content);
			var details_container_title = (record_data.f_name)?record_data.f_name+' details':'Details Panel';
				
			details_container_titlebar.setTitle(details_container_title);
			details_container.add([new_details_panel]).show({type:'pop',duration:500,easing:'ease-out'});
		}
		else
		{
			details_container_titlebar.setTitle('Details Panel');
		}
	},
	//When the nested list is initialized add sorter panel
	dmtNestedListInitialize:function(list)
	{
        var _this = this;
		console.log('List Initialized')
		//Add the sorting panel to the nested list
		list.insert(0,{xtype: 'dmtnestedlistsortpanel'});	
		
		//Reload the store to enable re-initialization
		Ext.getStore('DmtFolderStructureStore').load();
		list.setStore('DmtFolderStructureStore');	
		
		
		console.log('List Store loaded');
		//Add the user_name param to the polling function
		var base_params ={
							user_name: this.dmtGetUsernameFromCache(),
						 };
		//Build the config for the notification polling				 
		var dmt_polling = { 
           interval:6000,
           type:'polling',
           url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_polling.php?',
           baseParams:base_params,
           id:'dmt-notification-polling',
           listeners:
           {
			data:function(provider,event_data)
			{
				switch(event_data._name)
				{
					//IF THE EVENT NEW FILE ADDED IS SENT
					case 'new_file_added':
					var notification_count = event_data.getData().length;
					if(notification_count > 0)
					{
						var notifications_tab = Ext.getCmp('dmt-notifications-list');
						
						var nested_list_refresh_button = Ext.getCmp('dmt-nested-list-refresh-button');
						nested_list_refresh_button.addCls('dmtRefreshToRemoveNotifications');
						
						notifications_tab.getStore().setData(event_data.getData());
						notifications_tab.getStore().load();
						
						notifications_tab.tab.setBadgeText(notification_count);
						console.log(notification_count);
					}
					break

				}
			},
				exception:function(e)
				{
					//Handle the exception here 
					console.log(e);
				}
			}
   		 };
           //Add the polling config to the Ext.direct Manager thus registering it and connecting it. 
        Ext.direct.Manager.addProvider(dmt_polling);        
    },
	//When a  node is tapped on the nested list
	dmtNestedListItemTap:function(nested_list,current_list,index,target,record)
	{
           console.log('Item Tapped');
           if(!record.isLeaf())
                current_f_id = record.getData().f_id;
           
           //check if file exists
           var file_name_url = record.getData().f_attachment;   
           var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);   
           var structure = record.getData().f_folder;
           this.dmtCheckFileExists(structure + "/"+ file_name,record);
    },
    //Checks if file exists or not
    dmtCheckFileExists: function(filename,record){
        //get reference to the 'this' object.
        var _this = this;
           
        fileSystemRoot.getFile(root_file_path +"/"+filename,
                                  {},
                                  function(fileEntry){
                               
                                        _this.dmtDetailsPanelChange(record,null,true);                                 
                                  },
                                  function(err){
                                        _this.dmtDetailsPanelChange(record,null,false);                                 
                                  });
    },
    //When a leaf node is tapped on the nested list
    dmtNestedListLeafItemTap:function(nested_list,current_list,index,target,record)
	{
		console.log('Leaf Item Tapped');
	},
	//When a back button is tapped on the nested list
	dmtNestedListBackTap:function(current,last_node,last_active_list)
	{
		console.log('Back Button Tapped');
        current_f_id = last_node.parentNode.getData().f_id;
        this.dmtDetailsPanelChange(last_node.parentNode,null);
	},
	//When the user clicks on the refresh button on the nested list
	dmtNestedListRefreshButton:function(button)
	{
        if(navigator.onLine)
        {
           IntelliDocs.write_json(true,this.dmtGetUsernameFromCache());
        Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});
        var nested_list_store = Ext.getCmp('dmt-nested-list').getStore();
           nested_list_store.setSorters([
                                         {property:'f_type',direction:'DESC'},  
                                         {sorterFn:function(record1,record2){
                                         
                                         var  item1 = record1.data.f_item_id,
                                         item2 = record2.data.f_item_id;
                                         
                                         item1 = (!item1)? 999999999 : item1;
                                         item2 = (!item2)? 999999999 : item2;
                                         
                                         return item1 < item2 ? 1 : (item1 == item2 ? 0 : -1);
                                         
                                         },direction:'DESC'},			
                                         {property:'f_name',direction:'ASC'},
                                        ]);
        Ext.getCmp('dmt-nested-list-sort-by-name').setIconCls('arrow_down');
        Ext.getCmp('dmt-nested-list-sort-by-type').setIconCls('arrow_down');

		button.removeCls('dmtRefreshToRemoveNotifications');
		this.dmtDetailsPanelChange(null,{f_type:''},null);
        }
        else
        {
           Ext.Msg.alert('','You are currently offline');
        }
	},
           /////////////////////////////////////////////START OF NEW CODE DTD 26SEP12//////////////////////////////////
           dmtNestedListLoad:function(list,store,records,successful,oprtn)
           {
           var _this = this;
           console.log('Nested List Load Complete.');
           if(current_f_id)
           {
           Ext.Object.each(records,function(index,record) {
                           var found_node = _this.findInParentNode(record);
                           if(!found_node)
                           {
                           found_node 	= record.findChildBy(_this.findInChildNode, this, true );
                           if(found_node)
                           {
                           var parents = _this.dmtTreverseNodes(found_node,[]).reverse();
                           parents.push(found_node.id);
                           for(i=0;i<parents.length;i++)
                           {
                           list.goToNode(store.getNodeById(parents[i]));
                           }
                        }
                    }
                    else
                    {
                           list.goToNode(store.getNodeById(found_node.id));
                    }
                           
                });
           }
           //Moved function to intialize due to reload of certain components.
           },
           //Added this function to traverse to root node
           dmtTreverseNodes:function(record,parents)
           {		
           if(record.parentNode)
           {	
           parents.push(record.parentNode.id);	
           this.dmtTreverseNodes(record.parentNode,parents);
           }
           return parents;	
           },
           //Added this function to find if parent had the required id.
           findInParentNode:function(record)
           {
           if(record.getData().f_id == current_f_id)
           return record;
           
           return false;	
           },
           //Added this function to check if child nodes had the required id.
           findInChildNode:function(record)
           {
           if(record.getData().f_id == current_f_id)
           return true;
           
           return false;	
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
	}
	

});