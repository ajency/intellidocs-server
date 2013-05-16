var fileSystemRoot;
var root_file_path;
var IntelliDocs = {};

//global var for folder removal
var global_remove_folders = [];
var global_removed_folder_count = 0; 
var global_folder_removed = false;
            
//global files deletion array
var global_delete_files_list = [];

//global longpress 
var _prev_record = null;

//global user logged in
var global_is_user_logged_in = false;

//global long press
var global_long_press = false;

//global root view
var global_root_view = true;
var global_goto_node = 0;

var global_init_launch = true;

var global_app_version = 'Version: 1.2.5';
   
//global https
var global_https = "https://www.intellidocs.net";
//var global_https = "https://www.press-port.com";

document.addEventListener('deviceready',function(){
    //request a file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT,
                             0,
                             IntelliDocs.fileSystemSuccessCallbck,
                             IntelliDocs.fileSystemFailCallbck);  
   
    /** 
      *  perfomr  a check for any deleted folders 
      */
   	 if (navigator.onLine)
     {
         
         //perform polling here
         var request = new XMLHttpRequest();
         request.open("GET", global_https + "/wp-content/plugins/aj-file-manager-system/includes/ajax_folder_deactivated.php", true);
         request.onreadystatechange = function ()
         {
             if (request.readyState == 4 && request.status == 200)
             {
                 var res_data = eval("(" + request.responseText + ")");
                 global_remove_folders = res_data['data'];
                 if (global_remove_folders.length > 0)
                 {
                     IntelliDocs.remove_directory(global_remove_folders[0].folder);
                 }
             }
         }
         request.send();
     }
    
    /**
     * handle backevent
     *
     */
     document.addEventListener("backbutton", function(e){
    	e.preventDefault();
    	if(global_root_view)
    	{
    		Ext.Msg.confirm('','Are you sure you want to exit?',
                    function(buttonId){
    			 		if(buttonId == 'yes'){
    			 			navigator.app.exitApp();
    			 		}
    		});	
    	} 
    	else
    	{
    		 // move the app one folder back
    		 Ext.getCmp('dmt-nested-list').goToNode(global_goto_node.parentNode);
    		 
    		 IntelliDocs.dmtDetailsPanelChange(global_goto_node.parentNode,null,false);
    		 
    		 Ext.getCmp('dmt-details-container-titlebar').setTitle("");   
    		 
    		 if(global_goto_node.parentNode == null || global_goto_node.parentNode == 'undefined')
    		 {
    			 global_root_view = true;
    			 Ext.Msg.confirm('','Are you sure you want to exit?',
                         function(buttonId){
                             if(buttonId == 'yes'){
                                 navigator.app.exitApp();
                             }
                 });
    		 }
    		 else
    			 global_goto_node = global_goto_node.parentNode;
    	}
     },false);
    
},false);



IntelliDocs.dmtDetailsPanelChange = function(record,deafult_panel,file_exists)
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

		console.log(file_ext.toLowerCase());

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
				        	instructions: '&copy; Intellidocs.net',
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
			        	instructions: '&copy; Intellidocs.net',
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

};
 

IntelliDocs.intellidocs_session_timeout = function(controller)
{
    Ext.Msg.alert('Session Expired','Your session on the server has expired.Please login in again.');
    IntelliDocs.dmtSecureLoginLogout();
    var main_container = Ext.getCmp('dmt-main-container');
    
    
    //To create a new instance of the secure login destroy the old one if it exists.
    if(Ext.getCmp('dmt-secure-login-panel'))
        Ext.getCmp('dmt-secure-login-panel').destroy();
    
    var dmt_secure_login_panel = Ext.create('DMTApp.view.DmtSecureLogin');
    main_container.setActiveItem(dmt_secure_login_panel);
    
    //Disconnect the notification polling and release the resources/
    var notification_polling = Ext.direct.Manager.getProvider('dmt-notification-polling');
    notification_polling.disconnect();
}

IntelliDocs.dmtSecureLoginLogout = function()
{
    var login_info_store = Ext.getStore('DmtLocalStorageCookie');
    login_info_store.load();
    
    var index = login_info_store.find('key','dmtScLgInfo');
    
    if(index == -1)
    {
        //setup localstorage with values
        var record = Ext.create('DMTApp.model.DmtLocalStorageCookieModel', {key: 'dmtScLgInfo',value: 'loggedOutSuccessfully'});
        record.save();	
    }
    else
    {
        //Get the old value and set new value
        var record = login_info_store.getAt(index);
        record.set('value','loggedOutSuccessfully');
        record.save();
    }

}


            
IntelliDocs.dmtGetUsernameFromCache = function()
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


IntelliDocs.fileSystemFailCallbck = function(error){
    console.log("error:" + error);
}

IntelliDocs.fileSystemSuccessCallbck = function(fileSystem){
    // get the root file system object
    fileSystemRoot = fileSystem.root;
    console.log("Got the file system root object");
    
    //get the full path to root directory
    root_file_path = fileSystem.root.fullPath;
    console.log("Got the full path to root directory",root_file_path);
    
    fileSystemRoot.getDirectory("intellidocs",
            {create: true, exclusive: false}, 
            function(dir){
            	
            }, 
            function(err){
                console.log(err.code + 'Folder exists.');
            });
    
    root_file_path += "/intellidocs";
    root_file_path = root_file_path.substr(7);
    
}

/**
 * Gets the directory structure for the specified user and creates a file dir_list.js
 * is_not_offline = check to remove masking
 * user_name      = the username to get directory structure for 
 */
IntelliDocs.write_json = function(is_not_offline,user_name){
    var ajax = new XMLHttpRequest();
    ajax.open("GET", global_https+"/wp-content/plugins/aj-file-manager-system/includes/ajax_request.php?user_name="+user_name,true);
    ajax.send();
    
    ajax.onreadystatechange = function()
    {
    	if(ajax.readyState == 4)
        {
            if(ajax.status == 200)
            {
                var data_to_write = ajax.responseText;
                var session_data = eval(data_to_write);
                //check for session here. If vaLID WRITE. else redirect to login
                if(!session_data.session)
                {
                    IntelliDocs.intellidocs_session_timeout();
                }
                else
                {
		            //got the file data. get the dir_list.js file. 
		            fileSystemRoot.getFile(	root_file_path+"/dir_list.js", 
           							{create: true},
           							function(fileEntry) {
                                   		// Create a FileWriter object for our FileEntry.
                                   		fileEntry.createWriter(function(fileWriter) {
                                               	fileWriter.onwrite = function(e) {
                                        	   	console.log('JS file Write completed.');
                                            	//set global app launch to false
                                                DMTApp.launched = false;
                                            	
                                            	if(global_init_launch)
                                            		global_init_launch = false;
                                            	
                                                if(is_not_offline)
                                                {
     		                                    	Ext.getStore('DmtFolderStructureStore').load();
                                                    Ext.getStore('DmtFolderStructureStore').dmtRemoveNotificationsFromServer();
                                                    Ext.getCmp('dmt-nested-list').unmask(); 
                                                 }               
                                           };                              
                                           fileWriter.write(data_to_write);
                                    	},
                                    	function(e){console.log('Error' + e.code);});
                                   },function(e){console.log('Error' + e.code);});
                }
            } 
            else
            {
                Ext.getCmp('dmt-nested-list').unmask();
                Ext.Msg.alert('','Failed to read data from server. Please try again');
            }
        };              
    }
}


/**
  * Remove DIrectory and all of its content
  * dir_path = path of directory to be removed
  */            
IntelliDocs.remove_directory = function(dir_path)
{
	var _dir_path = root_file_path+'/'+dir_path;
    fileSystemRoot.getDirectory(_dir_path,
                                {},
                                function(directory){
                                    directory.removeRecursively(function(parent){
                                                            console.log("Remove Recursively Succeeded");   
                                                            //check if was last
                                                            global_folder_removed = true;
                                                            global_removed_folder_count++;
                                                            if(global_removed_folder_count == global_remove_folders.length)
                                                            {
                                                                //reset globals
                                                                global_folder_removed = false;
                                                                global_remove_folders = [];
                                                                global_removed_folder_count = 0;
                                                            }
                                                            else if(global_removed_folder_count < global_remove_folders.length)
                                                            {
                                                                IntelliDocs.remove_directory(global_remove_folders[global_removed_folder_count].folder);
                                                            }
                                                        },
                                                        function(err){
                                                            console.log("Failed to remove direcoty and files" + err.code);
                                                            global_folder_removed = true;                                                                       
                                                            global_removed_folder_count++;
                                                            if(global_removed_folder_count == global_remove_folders.length)
                                                            {
                                                                global_folder_removed = false;
                                                                global_remove_folders = [];
                                                                global_removed_folder_count = 0;
                                                            }
                                                            else if(global_removed_folder_count < global_remove_folders.length)
                                                            {
                                                                IntelliDocs.remove_directory(global_remove_folders[global_removed_folder_count].folder);
                                                            }                                                                
                                                        }); 
                                },
                                function(err){
                                    console.log('Directory doesn\'t exists: Skipp'+ err.code);
                                    global_removed_folder_count++;
                                    if(global_removed_folder_count == global_remove_folders.length)
                                    {
                                        global_folder_removed = false;
                                        global_remove_folders = [];
                                        global_removed_folder_count = 0;  
                                    }
                                    else if(global_removed_folder_count < global_remove_folders.length)                                             
                                    {
                                        IntelliDocs.remove_directory(global_remove_folders[global_removed_folder_count].folder);
                                    }
                                });
}

/**
 * trigger the bulk download event
 * directory_path = path of folder to download 
 * file_urls = array of file URL's to download
 * concurrent downloads 
 */       
var global_queued_file_urls = [];
var global_queued_file_download_complete_count = 0;
var global_current_download_folder_id = 0;
var global_download_file_count = 0;

IntelliDocs.download_queued_file = function(file)
{
    var structure = file.path;           
    var file_name = file.url;
    file_name = file_name.substring(file_name.lastIndexOf('/')+1);              
    
    fileSystemRoot.getFile(root_file_path + "/" + structure + "/" + file_name,
                           {},
                           function(file_entry){
                                console.log("File present. Skip");
                                global_queued_file_download_complete_count++;
                                if(global_queued_file_download_complete_count == global_queued_file_urls.length)
                                {
                                    //all files downloaded. reset globals here
                                    console.log('All files downloaded');
                                    //Ext.getCmp('dmt-download-progress-folder').destroy();
                                    if(Ext.getCmp('file-download-mask'))
                                    	Ext.getCmp('file-download-mask').destroy();
                                    
                                    if(global_download_file_count == 0)
                                    {
                                    	Ext.Msg.alert('', 'All files have already been downloaded', Ext.emptyFn);	
                                    }
                                    else
                                    {	
                                        var files = global_download_file_count == 1 ? global_download_file_count + ' file' : global_download_file_count + ' files';
                                        Ext.Msg.alert('', files + ' successfully downloaded', Ext.emptyFn);
                                    }    
                                    global_queued_file_urls = [];
                                    global_queued_file_download_complete_count = 0;
                                    global_current_download_folder_id = 0;
                                    global_download_file_count = 0;
                                    
                                    if(Ext.getCmp('dmtFileFolderPath'))
                                    	IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value, Ext.getCmp('dmtFileFolder_count')._value);                                            
                                 }
                                else{             
                                    IntelliDocs.download_queued_file(global_queued_file_urls[global_queued_file_download_complete_count]);  
                                }
                           },
                           function(err){
                                console.log('doesn\'t exists' + err.code);
                                var file_no = "("+ (global_queued_file_download_complete_count +1) +"/"+ global_queued_file_urls.length +")"
                                //document.getElementById('dmt-dolder-file-name').innerHTML = file_name ;                                            
                                //document.getElementById('dmt-folder-file-percentage').innerHTML = '0%';
                                
                                var fileProgressPanel = Ext.create('Ext.LoadMask',{
                            		id:'file-download-mask',
                            		indicator: true,
                            		html: '<p>'+file_name+'</p><p>Downloading...</p><p id="dmt-file-percent"></p>',
                            		message:'',
                                });
                                Ext.Viewport.add(fileProgressPanel);
                                
                                var fileDownloadTask = Ext.create('Ext.util.DelayedTask', function() {
									window.downloadFile(file.url,
											{
												dirName: root_file_path + '/' + structure,
												overwrite: false
											}, 
									     	function(res) {
												var percent = Math.round(res.progress);
												
												if(res.status == 1)
												{
													if(Ext.getCmp('file-download-mask'))
				                                    	Ext.getCmp('file-download-mask').destroy();
				                                    
													console.log("File Downloaded");
													 global_queued_file_download_complete_count++;
													 global_download_file_count++;
	                                                 if(global_queued_file_download_complete_count == global_queued_file_urls.length)
	                                                 {
	                                                	//all files downloaded. reset globals here
	                                                    console.log('All files downloaded');
	                                                    if(global_download_file_count == 0)
	                                                    {
	                                                        Ext.Msg.alert('', 'All files have already been downloaded', Ext.emptyFn);   
	                                                    }
	                                                    else
	                                                    {   
	                                                        var files = global_download_file_count == 1 ? global_download_file_count + ' file' : global_download_file_count + ' files';
	                                                        Ext.Msg.alert('', files + ' successfully downloaded', Ext.emptyFn);
	                                                    } 
	                                                    global_queued_file_urls = [];
	                                                    global_queued_file_download_complete_count = 0;
	                                                    global_current_download_folder_id = 0;
	                                                    global_download_file_count = 0;
	                                                    //Ext.getCmp('dmt-download-progress-folder').destroy();
	                                                    
	                                                 }
	                                                 else{             
	                                                    IntelliDocs.download_queued_file(global_queued_file_urls[global_queued_file_download_complete_count]); 
	                                                }
	
	                                                if(Ext.getCmp('dmtFileFolderPath'))
	                                                	IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,Ext.getCmp('dmtFileFolder_count')._value); 
												}
									     	},
									     	function(error) {
									     			console.log("Download failed:");
	                                               
	                                                //Ext.getCmp('dmt-download-progress-folder').destroy();
									     			if(Ext.getCmp('file-download-mask'))
				                                    	Ext.getCmp('file-download-mask').destroy();
				                                    
									     			if(global_download_file_count > 0)
	                                                {
	                                                    var files = global_download_file_count == 1 ? global_download_file_count + ' file' : global_download_file_count + ' files';
	                                                    Ext.Msg.alert('', files + ' successfully downloaded', Ext.emptyFn);
	                                                }
	                                                else
	                                                {
	                                                	Ext.Msg.alert('Download Failed!','Please try again!');
	                                                }
	                                                global_queued_file_urls = [];
	                                                global_queued_file_download_complete_count = 0;
	                                                global_current_download_folder_id = 0; 
	                                                global_download_file_count = 0;
	                                                
	                                                if(Ext.getCmp('dmtFileFolderPath'))
	                                                	IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,Ext.getCmp('dmtFileFolder_count')._value); 
									     	}
										);
                                });
                                
                                fileDownloadTask.delay(300);
                           });                                 
}

/**
 * loop through dir_list.js and find all the files to be downloaded
 * _json_obj = initially dir_list.js
 * category_id = objec to search for
 * function
 */
IntelliDocs.loop_json = function(_json_obj, category_id, subfolder_check)
{
    for(var key in _json_obj)
    {
        if(_json_obj.hasOwnProperty(key))
        {                        
            if(key == 'items')
            {
                var obj = _json_obj[key];
                if(obj.length > 0)
                {
                    for(var i=0; i < obj.length; i++)
                    {
                        var data = obj[i];
                        if((data['f_id'] == category_id   && data['f_type'] == 'folder'))
                        {
                            //match found. now get all leaf nodes from items array
                            console.log(data['f_name'] + ' Found the folder element');
                            
                            //set global folder ID
                            global_current_download_folder_id = category_id;
                            
                            //get all file urls
                            IntelliDocs.dmtCreateDirectories(data['f_folder']);
                         
                            IntelliDocs.get_all_leaf_elements(data['items'],subfolder_check);
                            break;
                        }
                        else
                        {
                            IntelliDocs.loop_json(data,category_id,subfolder_check);
                        }
                    }	
                }
            }	
        }
    }
}	

/**
 * loop through dir_list.js and find all the files to be downloaded
 * _json_obj = initially dir_list.js
 * category_id = objec to search for
 * function
 */
IntelliDocs.loop_root_json = function(_json_obj)
{
    for(var key in _json_obj)
    {
        if(_json_obj.hasOwnProperty(key))
        {                        
            if(key == 'items')
            {
                var obj = _json_obj[key];
                if(obj.length > 0)
                {
                    for(var i=0; i < obj.length; i++)
                    {
                        var data = obj[i];
                        if(data['f_type'] == 'folder')
                        {
                            //set global folder ID
                            global_current_download_folder_id = data['f_id'];
                            
                            //get all file urls
                            IntelliDocs.dmtCreateDirectories(data['f_folder']);
                         
                            IntelliDocs.recursive_looping(data['items']);
                        }
                    }	
                }
            }	
        }
    }
    
    if(global_queued_file_urls.length > 0)
    {
        console.log('Files count' + global_queued_file_urls.length);
        //trigger the bulk file download 
        IntelliDocs.download_queued_file(global_queued_file_urls[0]);
    }
    else{
        //we are not triggering file download. reset globals
        //Ext.getCmp('dmt-download-progress-folder').destroy();
    	//Ext.getCmp('file-download-mask').destroy();
        global_queued_file_urls = [];
        global_queued_file_download_complete_count = 0;
        global_current_download_folder_id = 0;
    }
    
}

IntelliDocs.recursive_looping = function(obj)
{
    for(var i=0; i < obj.length; i++)
        {
            var data = obj[i];
            
            if(data['leaf'] && (data['f_type'] == 'file'))
            {
                global_queued_file_urls.push({
                       url : data['f_attachment'],
                       path: data['f_folder']});
            }
            else if(data['f_type'] == "folder")
            {
                IntelliDocs.recursive_looping(data['items']);
            }
        }
}


/**
 * Loops through the category folder and add file urls to array
 * obj = category folder items array
 */
IntelliDocs.get_all_leaf_elements = function(obj,subfolder_check)
{
    
	if(subfolder_check)
	{
		IntelliDocs.recursive_looping(obj);
	}
	else
	{
		for(var i=0; i < obj.length; i++)
        {
            var data = obj[i];
           
            if(data['leaf'] && (data['f_type'] == 'file'))
            {
            	console.log("File found");
                global_queued_file_urls.push({
                	   url : data['f_attachment'],
                	   path: data['f_folder']});
            }
            else if(data['f_type'] == "folder" && subfolder_check)
            {
            	console.log("Dir found");
            	IntelliDocs.dmtCreateDirectories(data['f_folder']);
            	IntelliDocs.get_all_leaf_elements(data['items'],true);	
            }
        }
	}
	
    if(global_queued_file_urls.length > 0)
    {
        console.log('Files count' + global_queued_file_urls.length);
        //trigger the bulk file download 
        IntelliDocs.download_queued_file(global_queued_file_urls[0]);
    }
    else{
        //we are not triggering file download. reset globals
        //Ext.getCmp('dmt-download-progress-folder').destroy();
    	//Ext.getCmp('file-download-mask').destroy();
        global_queued_file_urls = [];
        global_queued_file_download_complete_count = 0;
        global_current_download_folder_id = 0;
    }
} 

/**
 * returns the folder meta data
 */
IntelliDocs.getFolderMeta = function(folder_path,total_files)
{
    
    var meta = '';
    var files_present = 0;
    var remaining_files = 0;
    var dir_count = 0;
    fileSystemRoot.getDirectory(root_file_path + "/"+ folder_path,
                                {},
                                function(directory)
                                {
                                    var reader = directory.createReader();
                                    reader.readEntries(function(entries){
                                                        for(var i = 0;i<entries.length; i++)
                                                        {
                                                            if(entries[i].isFile && entries[i].name != '.DS_Store')
                                                            {
                                                                files_present++;
                                                            }
                                                        }
                                                       
                                                       remaining_files = (total_files == files_present) ? 0 : (total_files - files_present);
                                                       meta = "Total Files: " + total_files +"/ Downloaded Files: " + files_present + "/ Remaining Files: " + remaining_files;
                                                       if(Ext.getCmp('dmt-folder-metadata'))
                                                    	   Ext.getCmp('dmt-folder-metadata').setHtml(meta);                                                               
                                                   },
                                                   function(err){
                                                                                                                            
                                                   });
                                },
                                function(err)
                                {
									//if directory doesn't exists
									console.log('Failed to load files details');
									meta = "Total Files: " + total_files +"/ Downloaded Files: 0 / Remaining Files: " + total_files;
									if(Ext.getCmp('dmt-folder-metadata'))
										Ext.getCmp('dmt-folder-metadata').setHtml(meta);  
                                });
    
    
}


IntelliDocs.dmtCreateDirectories = function(structure)
{
	//create folder if not present
    var dir_struct = structure.split('/');
    for(var i=0; i < dir_struct.length; i++)
    {
        var dir_path = '';
        for(var j=0; j <= i; j++)   
        {
            dir_path += dir_struct[j] + '/';
        }   
        
        fileSystemRoot.getDirectory(dir_path,
                                    {create: true, exclusive: false}, 
                                    function(dir){
                                        console.log('Dir created');
                                    }, 
                                    function(err){
                                        console.log(err.code + 'Folder exists. Lets check next');
                                    });
        
    }  
}

IntelliDocs.downloadFile = function(record)
{
    if(Ext.device.Connection.isOnline())
    {
        var file_url = record.getData().f_attachment;
        var file_name = file_url.substring(file_url.lastIndexOf('/')+1);
      
      /*  var progress_bar_panel_config =
            {
                    id:'dmt-download-progress',
                    width:300,
                    height:200,
                    hideOnMaskTap:false,
                    modal:true,
                    centered:true,
                    layout:
                    {
                        type:'vbox',
                        pack:'center',
                        align:'center',
                        },
                        items:
                        [
                         {
                         xtype:'titlebar',
                         docked:'top',
                         title:'Download'
                         },
                         {
                         xtype:'panel',
                         html:file_name,
                         },
                         {
                         xtype:'panel',
                         html:'<div id="loading-container">'+
                         '<div id="loading-box">'+
                         '<div id="loading-bar">'+
                         '<div id="percentage"></div>'+
                         '</div>'+
                         '</div>'+
                         '</div>',  
                         }
                        ]
            }
                       
        var fileProgressPanel = Ext.create('Ext.Panel',progress_bar_panel_config);
        Ext.Viewport.add(fileProgressPanel).show();*/
       
        var fileProgressPanel = Ext.create('Ext.LoadMask',{
    		id:'file-download-mask',
    		indicator: true,
    		html: '<p>'+ file_name +'</p><p>Downloading...</p><p id="dmt-file-percent"></p>',
    		message:'',
        });
        Ext.Viewport.add(fileProgressPanel);
        
        var fileDownloadTask = Ext.create('Ext.util.DelayedTask', function() {

        	var structure = record.getData().f_folder;

        	IntelliDocs.dmtCreateDirectories(structure);

        	//trigger the file download plugin
        	window.downloadFile(file_url,{
        		dirName: root_file_path + '/' + structure,
        		overwrite: false
        	}, 
        	function(res) {

        		var percent = Math.round(res.progress);
        		//document.getElementById('dmt-file-percent').innerHTML = percent + '%';
        		//fileProgressPanel.setHtml('<p>'+ file_name +'</p><p>Downloading...</p><p>'+ percent +'% </p>');
        		console.log(res.status);
        		console.log(percent);
        		if(res.status == 1)
        		{
        			console.log("File Downloaded"); 
        			Ext.getCmp('file-download-mask').destroy();
        			Ext.getCmp('dmt-file-action-button').setText('Open');
        			window.openFile(root_file_path+"/"+structure+"/"+file_name);                                                       
        		}
        	},
        	function(error) {
        		console.log("Download failed:" + error);
        		if(error == 404)
        		{}
        		else
        		{
        			Ext.getCmp('file-download-mask').destroy();
        			Ext.Msg.alert('Download Failed!','Please try again!');
        		}
        	});

        	
        });
        
        fileDownloadTask.delay(300); 
    }
    else
    {
        Ext.Msg.alert('Offline','You are currently offline');
    }
} 


/*Performance Overrides*/
Ext.define('Ext.dataview.override', {
    override: 'Ext.DataView',
    deselectAll: function(supress) {
        var me = this,
            selections = me.getStore().getRange();

        me.deselect(selections, supress);

        me.selected.clear();
        me.setLastSelected(null);
        me.setLastFocused(null);
    }
});

Ext.define('Ext.button.override', {
    override: 'Ext.Button',

    onPress: function() {
        var me = this,
            element = me.element,
            pressedDelay = me.getPressedDelay(),
            pressedCls = me.getPressedCls();

        if (!me.getDisabled()) {
            if (pressedDelay > 0) {
                me.pressedTimeout = setTimeout(function() {
                    delete me.pressedTimeout;
                    if (element) {
                        element.addCls(pressedCls);
                    }
                }, pressedDelay);
            }
            else {
                element.addCls(pressedCls);
            }
        }
    },
    doRelease: function(me, e) {
        if (!me.getDisabled()) {
            if (me.hasOwnProperty('pressedTimeout')) {
                clearTimeout(me.pressedTimeout);
                delete me.pressedTimeout;
            }
            else {
                me.element.removeCls(me.getPressedCls());
            }
        }
    },
    doTap: function(me, e) {
        var handler = me.getHandler(),
            scope = me.getScope() || me;

        if (!handler) {
            return;
        }

        if (typeof handler == 'string') {
            handler = scope[handler];
        }

        //this is done so if you hide the button in the handler, the tap event will not fire on the new element
        //where the button was.
        e.preventDefault();

        handler.apply(scope, arguments);
    }
});


function read_file_data(file)
{
	var reader = new FileReader();
	reader.onloadend = function(evt) {
        console.log("Read as text");
        console.log(evt.target.result);
    };
    reader.readAsText(file);
}