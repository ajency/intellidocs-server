/////////////////////////////////////////////START OF NEW CODE DTD 26SEP12//////////////////////////////////
var current_f_id; 
/////////////////////////////////////////////END OF NEW CODE DTD 26SEP12//////////////////////////////////
Ext.define('DMTApp.controller.DmtNestedListController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			 //Referencing the nested list by its xtype
            dmtNestedList			  :'.dmtnestedfolderlist',
			 //Used the button action to prevent conflict on reinitialization.
			dmtNestedListRefreshButton:'button[action=dmtNestedListRefreshButton]',
			dmtDetailsPanel:'[id=dmt-details-container]',
			dmtnestedlistbackbutton : 'button[action=dmtNestedListBackButton]'
        },
        control: {
            dmtNestedList:
			{
				itemtap		:'dmtNestedListItemTap',
				itemtaphold : 'dmtListItemTapHold',
				initialize	:'dmtNestedListInitialize',
			},
			dmtNestedListRefreshButton:
			{
				tap			:'dmtNestedListRefreshButton'		
			},
			dmtnestedlistbackbutton : {
				tap 		: 'dmtBackButtonAction'
			}
        }
    },
    dmtBackButtonAction:function(button){
        
        var _this = this;
        var f_id = button.current_f_id.f_parent;
        var f_folder = button.current_f_id.f_folder;
        
        if(f_id == 0) Ext.getCmp('dmt-nested-list-back-button').hide();
        
        if(Ext.getCmp('dmt-details-view-card'))
         Ext.getCmp('dmt-details-view-card').destroy();
        
         //Reload the store to enable re-initialization
        var str = button.getParent().getParent().getParent().getStore();
        
        var record = {};
        //we have all data in db. trigger db here
        db.transaction(function(tx){
                       tx.executeSql("SELECT * FROM intellidocs_folders WHERE f_id='"+button.current_f_id.f_parent+"'",[],
                                     function(tx,results){
                                     
                    	   			if(results.rows.length == 0)
                                     {
                                         Ext.getCmp('dmt-nested-list-title-bar').setTitle('Files');
                                         return;
                                     }
                                     
                                    
                                     var i = 0;
                                     record = Ext.create('DMTApp.model.DmtFolderStructureModel',{
                                                             items	: [],
                                                             f_id   	: results.rows.item(i).f_id,
                                                             f_name 	: results.rows.item(i).f_name,
                                                             f_type	: results.rows.item(i).f_type,
                                                             f_ext	: results.rows.item(i).f_ext,
                                                             f_attachment	: results.rows.item(i).f_attachment,
                                                             f_modified		: results.rows.item(i).f_modified,
                                                             f_folder		: results.rows.item(i).f_folder,
                                                             f_description 	: results.rows.item(i).f_description,
                                                             f_solicitor		: results.rows.item(i).f_solicitor,
                                                             f_item_id		: '',
                                                             f_file_count	: results.rows.item(i).f_file_count,
                                                             f_parent		: results.rows.item(i).f_parent,
                                                             fld_item_id		: results.rows.item(i).f_fld_item_id,
                                                             f_sub_fld_count	: results.rows.item(i).f_folder_count,
                                                             f_folders		: []
                                                             })
                                     
                                     _this.dmtDetailsPanelChange(record,null);
                                     
                                     
                                     if(f_id > 0)
                                         Ext.getCmp('dmt-nested-list-title-bar').setTitle(record.getData().f_name);
                                     else
                                         Ext.getCmp('dmt-nested-list-title-bar').setTitle('Files');
                                     
                                     if(record.getData().f_parent != 0)
                                     {
                                         tx.executeSql("SELECT f_folder FROM intellidocs_folders WHERE f_id='"+record.getData().f_parent+"'",[],
                                                   function(tx,results)
                                                   {
                                                   Ext.getCmp('dmt-nested-list-back-button').current_f_id  = {
                                                     f_id : record.getData().f_id,
                                                     f_parent : record.getData().f_parent,
                                                     f_folder : results.rows.item(0).f_folder
                                                   };
                                             });
                                     }
                                     else
                                     {
                                             Ext.getCmp('dmt-nested-list-back-button').current_f_id  = {
                                                     f_id : record.getData().f_id,
                                                     f_parent : record.getData().f_parent,
                                                     f_folder : ''
                                                 }
                                     }
                                     
                                 });
                       
                       var sql = (f_id === 0 ) ? "SELECT * FROM intellidocs_folders WHERE f_parent='0')" :
                                                 "SELECT * FROM intellidocs_folders WHERE f_parent='"+f_id+"'";
                       tx.executeSql(sql,[],
                                     function(tx, results){
                                     var len = results.rows.length;
                                     var f_data = [];
                                     for (var i=0; i<len; i++)
                                     {
                                         f_data.push({
                                                 items	: [],
                                                 f_id   	: results.rows.item(i).f_id,
                                                 f_name 	: results.rows.item(i).f_name,
                                                 f_type	: results.rows.item(i).f_type,
                                                 f_ext	: results.rows.item(i).f_ext,
                                                 f_attachment	: results.rows.item(i).f_attachment,
                                                 f_modified		: results.rows.item(i).f_modified,
                                                 f_folder		: results.rows.item(i).f_folder,
                                                 f_description 	: results.rows.item(i).f_description,
                                                 f_solicitor		: results.rows.item(i).f_solicitor,
                                                 f_item_id		: '',
                                                 f_file_count	: results.rows.item(i).f_file_count,
                                                 f_parent		: results.rows.item(i).f_parent,
                                                 fld_item_id		: results.rows.item(i).f_fld_item_id,
                                                 f_sub_fld_count	: results.rows.item(i).f_folder_count,
                                                 f_folders		: []
                                                 });
                                     }
                                     //Ext.getStore('DmtFolderStructureStore').setData(f_data);
                                     str.setData({'items' : f_data});
                                     str.sort([{property:'f_type',direction:'DESC'},{property:'f_ext',direction:'DESC'},{property : 'fld_item_id',direction:'DESC'}]);
                                     
                                   },
                                   function(err){
                                     console.log("Error fetching data");
                                   });
                       
                       });
    },
    dmtNestedListChange:function( _this,list,eOpts )
    {
    	Ext.Viewport.unmask();
        //list.un('itemtaphold',this.dmtListItemTapHold);
        //list.on('itemtaphold',this.dmtListItemTapHold);
    },
    dmtListItemTapHold:function(list, index, target, record, e, eOpts)
    {
    	if(record.getData().f_type === 'file')
        {
        	global_long_press = true;
        	var file_name_url = record.getData().f_attachment;
        	var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);
        	var folder_path = record.getData().f_folder;
           
        	fileSystemRoot.getFile(root_file_path+"/"+folder_path+"/"+file_name,
                   {},
                   function(fileEntry){
                     IntelliDocs.dmtDetailsPanelChange(record,null,true);
                   },
                   function(err){
                     IntelliDocs.dmtDetailsPanelChange(record,null,false);
                   });
           
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
		
		var file_date 		= (record_data.f_modified && record_data.f_modified != '') ? record_data.f_modified : '';
		var file_ext  		= (record_data.f_ext && record_data.f_ext != '')? f_ext : '';
		var file_name 		= (record_data.f_name && record_data.f_name != '')? record_data.f_name : '';
		var file_solicitor 	= (record_data.f_solicitor && record_data.f_solicitor != '')? record_data.f_solicitor : '';
		var file_item_id  	= (record_data.f_item_id && record_data.f_item_id != '')? record_data.f_item_id : '';
		var file_desc  		= (record_data.f_description && record_data.f_description != '')? record_data.f_description : '';

       

		switch (record_data.f_type)
		{
		case 'file':

			
			panel_content = {
					xtype: 'formpanel',
					id: 'dmt-details-view-card',
					layout: {
						align: 'center',
						pack: 'center',
						type: 'vbox'
					},
					styleHtmlContent: false,
					scrollable: {
						direction: 'vertical',
						directionLock: true,
						momentumEasing: {
							momentum: {
								acceleration: 30,
								friction: 0.5
							},
							bounce: {
								acceleration: 0.0001,
								springTension: 0.9999,

							},
							minVelocity: 5
						},
						outOfBoundRestrictFactor: 0
					},
					items: [
					        {
					        	xtype: 'image',
					        	height: 96,
					        	width: 96,
					        	src:'resources/images/folder_icons/'+ file_ext.toLowerCase() + '.png',
					        	id:'dmt-file-icon',
					        	margin:'0 0 30 0'
					        },
					        {
					        	xtype: 'fieldset',
					        	id: 'details-panel-fieldset',
					        	width: '90%',
					        	defaults: {
					        		labelAlign: 'left'
					        	},
					        	instructions: '&copy; IntelliDocs.net',
					        	items: [
					        	        {
					        	        	xtype: 'textfield',
					        	        	id: 'dmt-file-meta-name',
					        	        	hidden:(file_name)?false:true,
					        	        			label: 'Name',
					        	        			readOnly: true,
					        	        			value:file_name
					        	        },
					        	        {
					        	        	xtype: 'textfield',
					        	        	id: 'dmt-file-meta-date',
					        	        	hidden:(file_date)?false:true,
					        	        			label: 'Publish Date',
					        	        			readOnly: true,
					        	        			value:file_date
					        	        },
					        	        {
					        	        	xtype: 'textfield',
					        	        	id: 'dmt-file-meta-ext',
					        	        	hidden:(file_ext)?false:true,
					        	        			label: 'Type',
					        	        			readOnly: true,
					        	        			value:file_ext
					        	        },
					        	        {
					        	        	xtype: 'textfield',
					        	        	id: 'dmt-file-meta-solicitor',
					        	        	hidden:(file_solicitor)?false:true,
					        	        			label: 'Solicitor',
					        	        			readOnly: true,
					        	        			value:file_solicitor
					        	        },
					        	        {
					        	        	xtype: 'textfield',
					        	        	id: 'dmt-file-meta-item-id',
					        	        	hidden:(file_item_id)?false:true,
					        	        			label: 'Item ID',
					        	        			readOnly: true,
					        	        			value:file_item_id
					        	        },
					        	        {
					        	        	xtype: 'textareafield',
					        	        	id: 'dmt-file-meta-desc',
					        	        	hidden:(file_desc)?false:true,
					        	        			label: 'Description',
					        	        			readOnly: true,
					        	        			value:file_desc
					        	        },
					        	        {
					        	        	xtype: 'hiddenfield',
					        	        	id: 'dmtFileUrl',
					        	        	name: 'document_url',
					        	        	value:record_data.f_attachment
					        	        },
					        	        {
					        	        	xtype: 'hiddenfield',
					        	        	id: 'dmtFileFolder',
					        	        	name: 'document_folder',
					        	        	value:record_data.f_folder
					        	        },
					        	        {
					        	        	xtype: 'hiddenfield',
					        	        	id: 'dmtFileFolder_id',
					        	        	name: 'document_folder_id',
					        	        	value:record_data.f_id
					        	        }
					        	        ]
					        },
					        {
					        	xtype: 'container',
					        	id: 'dmt-details-panel-btn-container',
					        	minHeight: 60,
					        	layout: {
					        		align: 'center',
					        		pack: 'center',
					        		type: 'vbox'
					        	},
					        	items: [
					        	        {
					        	        	xtype: 'button',
					        	        	cls: 'dmt-details-panel-download-button',
					        	        	id: 'dmt-file-action-button',
					        	        	action:buttonAction,
					        	        	ui: 'confirm',
					        	        	width: 150,
					        	        	height:40,
					        	        	iconAlign: 'right',
					        	        	iconCls: 'download',
					        	        	iconMask: true,
					        	        	text: buttonText
					        	        }
					        	        ]
					        }
					        ]
			};

			if(file_exists)
			{
				panel_content.items[2].items.push({
					xtype:'button',
					text:"Delete File",
					margin: '30 0 0 0',
					cls:'dmt-details-panel-download-button',
					ui:'round',
					iconCls:'delete',
					iconMask:true,
					iconAlign:'right',
					width:150,
					height:40,
					action:"dmtDetailsPanelDeleteButton"
				});
			}	


			break;
			//END NEW CHANGES	
		case 'folder':

			panel_content = {
				xtype: 'formpanel',
				id: 'dmt-details-view-card',
				layout: {
					align: 'center',
					pack: 'center',
					type: 'vbox'
				},
				styleHtmlContent: false,
				scrollable: {
					direction: 'vertical',
					directionLock: true,
					momentumEasing: {
						momentum: {
							acceleration: 30,
							friction: 0.5
						},
						bounce: {
							acceleration: 0.0001,
							springTension: 0.9999,

						},
						minVelocity: 5
					},
					outOfBoundRestrictFactor: 0
				},
				items: [
				        {
				        	xtype: 'image',
				        	height: 96,
				        	width: 96,
				        	src:'resources/images/folder_icons/'+ file_ext.toLowerCase() + '.png',
				        	id:'dmt-file-icon',
				        	margin:'0 0 30 0'
				        },
				        {
				        	xtype: 'fieldset',
				        	id: 'details-panel-fieldset',
				        	width: '90%',
				        	defaults: {
				        		labelAlign: 'left'
				        	},
				        	instructions: '&copy; IntelliDocs.net',
				        	items: [
				        	        {
				        	        	xtype: 'textfield',
				        	        	id: 'dmt-file-meta-name',
				        	        	hidden:(file_name)?false:true,
				        	        			label: 'Name',
				        	        			readOnly: true,
				        	        			value:file_name
				        	        },
				        	        {
				        	        	xtype: 'hiddenfield',
				        	        	id: 'dmtFileFolderId',
				        	        	name:'document_folder_id',
				        	        	value:record_data.f_id
				        	        },
				        	        {
				        	        	xtype: 'hiddenfield',
				        	        	id: 'dmtFileFolderPath',
				        	        	name:'document_folder_path',
				        	        	value:record_data.f_folder
				        	        },
				        	        {
				        	        	xtype: 'hiddenfield',
				        	        	id: 'dmtFileFolder_count',
				        	        	name:'document_folder_count',
				        	        	value:record_data.f_file_count
				        	        }
				        	        ]
				        },
				        {
				        	xtype: 'container',
				        	id: 'dmt-details-panel-btn-container',
				        	minHeight: 60,
				        	width:'90%',
				        	layout: {
				        		align: 'center',
				        		pack: 'center',
				        		type: 'vbox'
				        	},
				        	items: [
				        	        {
				        	        	html : '<p></p>',
				        	        	width:'100%',
				        	        	height: 30,
				        	        	cls: 'dmt-folder-metadata-cls',
				        	        	id : 'dmt-folder-metadata' 
				        	        }
				        	        ]
				        }
				        ]
		};

			var dir_count = record_data.f_sub_fld_count;

			if(record_data.f_file_count > 0)
			{
				panel_content.items[2].items.push({ 
					xtype:'button',
					text:'Update Folder',
					cls:'dmt-details-panel-folder-download-button',
					margin:'20 0 0 0',
					ui:'confirm round',
					iconCls:'download',
					iconMask:true,
					iconAlign:'right',
					width:250,
					height:32,
					action:'dmtDetailsPanelFolderDownloadButton',
				});
			}
			
			/**
			if(dir_count > 0)
			{
				panel_content.items[2].items.push({	
					xtype:'button',
					text:'Download Files In Sub Folder',
					cls:'dmt-details-panel-folder-download-button',
					margin:'20 0 0 0',
					ui:'confirm round',
					iconCls:'download',
					iconMask:true,
					iconAlign:'right',
					width:250,
					height:32,
					action:'dmtDetailsPanelSubFolderDownloadButton',
				});
			}*/

			if(record_data.f_file_count > 0)
			{
				panel_content.items.push({ 
					xtype:'button',
					text:'Delete Files In Folder',
					cls:'dmt-details-panel-folder-download-button',
					margin:'20 0 0 0',
					ui:'round',
					iconCls:'delete',
					iconMask:true,
					iconAlign:'right',
					width:250,
					height:32,
					action:'dmtDetailsPanelFolderDeleteFilesButton',
				});
			}

			break;
		default:
			panel_content = null;
			break;
		}
	
		
		if(Ext.getCmp('dmt-details-view-card'))
				Ext.getCmp('dmt-details-view-card').destroy();
		
		if(panel_content)
		{		
			//var new_details_panel = Ext.create('Ext.Panel',panel_content);
			var new_details_panel = Ext.create('Ext.form.Panel',panel_content);
			
			var details_container_title = (record_data.f_name)?record_data.f_name+' details':'Details Panel';
				
			details_container_titlebar.setTitle(details_container_title);
			details_container.add([new_details_panel]).show();
			
	        IntelliDocs.getFolderMeta(record_data.f_folder,record_data.f_file_count);
		}
		else
		{
			details_container_titlebar.setTitle('Details Panel');
		}
		
		this.getDmtDetailsPanel().unmask();
	},
	//When the nested list is initialized add sorter panel
	dmtNestedListInitialize:function(list)
	{
        var _this = this;
        //Add the sorting panel to the nested list
        list.insert(0,{xtype: 'dmtnestedlisttitlebar'});
		list.insert(1,{xtype: 'dmtnestedlistsortpanel'});	
		
		if(Ext.getCmp('dmt-nested-list-back-button'))	
        	Ext.getCmp('dmt-nested-list-back-button').hide();
		
		Ext.getCmp('dmt-nested-list').mask();
		
		var str = Ext.getStore('DmtFolderStructureStore');
		list.setStore(str);
      
			
		db.transaction(function(tx){
            tx.executeSql("SELECT * FROM intellidocs_folders WHERE f_parent='0'",[],
                          function(tx, results){
                          if(results.rows.length > 0)
                          {
                              console.log("Load Previous");
                              sqlLoadComplete();
                          }
                          else
                          {
                              console.log("Load New Data");
                              IntelliDocs.write_json(true,_this.dmtGetUsernameFromCache(),false);
                          	}
                          },function(err){});
            });
		
		Ext.Viewport.unmask();
		
		//Add the user_name param to the polling function
		var base_params ={
							user_name: this.dmtGetUsernameFromCache(),
						 };
		//Build the config for the notification polling				 
		var dmt_polling = { 
           interval:(10*60*1000),
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
					
					}
					break;

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
    dmtNestedListItemTap:function(list, index, target, record, e, eOpts)
    {
        var _this = this;
       
        /** check if record is leaf record */
        if(record.getData().f_type === 'folder')
        {
           
           db.transaction(function(tx){
                          tx.executeSql("SELECT * FROM intellidocs_folders WHERE f_parent='"+record.getData().f_id+"'",[],
                                        function(tx, results){

                                        var len = results.rows.length;
                                        var f_data = [];
                                        for (var i=0; i<len; i++)
                                        {
                                            f_data.push({
                                                    items	: [],
                                                    f_id   	: results.rows.item(i).f_id,
                                                    f_name 	: results.rows.item(i).f_name,
                                                    f_type	: results.rows.item(i).f_type,
                                                    f_ext	: results.rows.item(i).f_ext,
                                                    f_attachment	: results.rows.item(i).f_attachment,
                                                    f_modified		: results.rows.item(i).f_modified,
                                                    f_folder		: results.rows.item(i).f_folder,
                                                    f_description 	: results.rows.item(i).f_description,
                                                    f_solicitor		: results.rows.item(i).f_solicitor,
                                                    f_item_id		: '',
                                                    f_file_count	: results.rows.item(i).f_file_count,
                                                    f_parent		: record.getData().f_id,
                                                    fld_item_id		: results.rows.item(i).f_fld_item_id,
                                                    f_sub_fld_count	: results.rows.item(i).f_folder_count,
                                                    f_folders		: []
                                                    
                                                });
                                        }
                                        
                                        Ext.getCmp('dmt-nested-list-title-bar').setTitle(record.getData().f_name);
                                        
                                        if(record.getData().f_parent != 0)
                                        {
                                            tx.executeSql("SELECT f_folder FROM intellidocs_folders WHERE f_id='"+record.getData().f_parent+"'",[],
                                                      function(tx,results)
                                                      {
                                                        Ext.getCmp('dmt-nested-list-back-button').current_f_id  = {
                                                                                                        f_id : record.getData().f_id,
                                                                                                        f_parent : record.getData().f_parent,
                                                                                                        f_folder : results.rows.item(0).f_folder
                                                                                                  };
                                                      });
                                        }
                                        else
                                        {
                                            Ext.getCmp('dmt-nested-list-back-button').current_f_id  = {
                                                f_id : record.getData().f_id,
                                                f_parent : record.getData().f_parent,
                                                f_folder : ''
                                            }
                                        }
                                        if(record.getData().f_parent >= 0) Ext.getCmp('dmt-nested-list-back-button').show();
                                        
                                        list.getStore().setData({'items' : f_data});
                                        list.getStore().sort([{property:'f_type',direction:'DESC'},{property:'f_ext',direction:'DESC'},{property : 'fld_item_id',direction:'DESC'}]);
                                        
                                        _this.dmtDetailsPanelChange(record,null,false);
                                        },
                                        function(err){
                                            console.log("errr" + err.code);
                                        });
                 
                          });
           }
           else
           {
                var createDetailsPanelDelayed = Ext.create('Ext.util.DelayedTask', function() {
                                                      
                                                      if(record.getData().f_type == 'file')
                                                      {
                                                      _this.dmtDetailsPanelChange(record,null,true);
                                                      //return;
                                                      //check if file exists
                                                      var file_name_url = record.getData().f_attachment;   
                                                      var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);   
                                                      var folder_path = record.getData().f_folder;
                                                      
                                                      fileSystemRoot.getFile(root_file_path + "/" + folder_path + "/" + file_name,
                                                                             {},
                                                                             function(fileEntry){
                                                                             window.openFile(root_file_path + "/" + folder_path +"/"+ file_name);
                                                                             _this.dmtDetailsPanelChange(record,null,true);
                                                                             },
                                                                             function(err){
                                                                             Ext.Msg.confirm('','Download file?',
                                                                                             function(buttonId){
                                                                                             if(buttonId == 'yes')
                                                                                             {
                                                                                             IntelliDocs.downloadFile(record);
                                                                                             }
                                                                                             });
                                                                             _this.dmtDetailsPanelChange(record,null,false);
                                                                             });
                                                      }
                                                      else
                                                      {
                                                      current_f_id = record.getData().f_id;
                                                      _this.dmtDetailsPanelChange(record,null,false);
                                                      }
                                                      });
           
           createDetailsPanelDelayed.delay(100);
        }
           
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
		
		var rcds = this.dmtTreverseNodes(last_node.parentNode,[]);
        global_root_view = (rcds.length == 0) ? true : false;
        
        global_goto_node = last_node.parentNode;
		
		this.dmtDetailsPanelChange(last_node.parentNode,null);
	},
	dmtFetchChildNode : function(rec)
	{
		var _this = this;
		
	},
	//When the user clicks on the refresh button on the nested list
	dmtNestedListRefreshButton:function(button)
	{
        if(Ext.device.Connection.isOnline())
        {
           Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});
           IntelliDocs.write_json(true,this.dmtGetUsernameFromCache());
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
                                         {property:'f_name',direction:'ASC'},
                                         {property:'fld_item_id',direction:'ASC'},
                                        ]);
        Ext.getCmp('dmt-nested-list-sort-by-name').setIconCls('arrow_down');
        Ext.getCmp('dmt-nested-list-sort-by-type').setIconCls('arrow_down');
        Ext.getCmp('dmt-nested-list-sort-by-item-id').setIconCls('arrow_down');
       
        if(button.hasOwnProperty('removeCls'))
			button.removeCls('dmtRefreshToRemoveNotifications');
		
		//this.dmtDetailsPanelChange(null,{f_type:''},null);
       }
       else
       {
       Ext.Msg.alert('','You are currently offline');
       }
	},
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