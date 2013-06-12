var fileSystemRoot;
var root_file_path;
var IntelliDocs = {};

//global var for folder removal
var global_remove_folders = [];
var global_removed_folder_count = 0; 
var global_folder_removed = false;

//longpress event global var
var _prev_record = null;

//global file exists
var global_check_file_in = [];
var global_looped_folder_count = 0;
var global_file_found_in = '';

//global user logged in
var global_is_user_logged_in = false;

//global longpress
var global_long_press = false;

//global app version
var global_app_version = 'Version : 1.3';

//global http vars. switch server with ease
//var global_https = "https://www.intellidocs.net";
var global_https = "https://www.press-port.com";

var db = null;
/*
(function(){
 //instantiate the DB
 db = window.openDatabase('intellidocs_app', '1.0', 'Intellidocs DB', 2 * 1024 * 1024);
 db.transaction(function (tx) {
                //tx.executeSql('DROP TABLE intellidocs_folders');return;
                
                tx.executeSql('CREATE TABLE IF NOT EXISTS intellidocs_folders( u_id , f_id, f_fld_item_id, f_item_id, f_folder, f_name, f_type, f_ext, f_solicitor, f_attachment, f_modified, f_description, f_file_count, f_folder_count, is_leaf, f_parent)');
                
                tx.executeSql('CREATE TABLE IF NOT EXISTS opened_files(file_path)');
                
                
                }, function(){
                
                }, function(){});
 })();
*/

/**
 * the main device ready event
 * (starting point for the phonegap app)
 */
document.addEventListener('deviceready',function(){
                          
                          //instantiate the DB
                          db = window.openDatabase('intellidocs_app', '1.0', 'Intellidocs DB', 2 * 1024 * 1024);
                          db.transaction(function (tx) {
                                         //tx.executeSql('DROP TABLE intellidocs_folders');return;
                                         
                                         tx.executeSql('CREATE TABLE IF NOT EXISTS intellidocs_folders( u_id , f_id, f_fld_item_id, f_item_id, f_folder, f_name, f_type, f_ext, f_solicitor, f_attachment, f_modified, f_description, f_file_count, f_folder_count, is_leaf, f_parent)');
                                         
                                         tx.executeSql('CREATE TABLE IF NOT EXISTS opened_files(file_path)');
                                         
                                         
                                         }, function(){
                                            
                                         }, function(){});
                          
                          //request a file system
                          window.requestFileSystem(LocalFileSystem.PERSISTENT,
                                                   0,
                                                   IntelliDocs.fileSystemSuccessCallbck,
                                                   IntelliDocs.fileSystemFailCallbck);  
                          
                          
                          },false);


var random = 100;
IntelliDocs.refillSQLData = function(loop)
{
	db.transaction(function(tx) {
                   //make all entries
                   for (var key in loop) {
                   if (loop.hasOwnProperty(key)) {
                   if (key == 'items') {
                        var obj = loop[key];
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                var d = obj[i];
                   
                                if (d['f_type'] == 'folder')
                                {
                                    tx.executeSql('INSERT INTO intellidocs_folders (u_id,      f_id,      f_fld_item_id, f_item_id,    f_folder,      f_name,      f_type,      f_ext,      f_solicitor,     f_attachment,      f_modified,      f_description,      f_file_count,      f_folder_count,   is_leaf, f_parent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                                    [d['u_id'], d['f_id'], d['fld_item_id'], 0, d['f_folder'], d['f_name'], d['f_type'], d['f_ext'], 'none', d['f_attachment'], d['f_modified'], d['f_description'], d['f_file_count'], d['f_sub_fld_count'], 0, d['f_parent']],
                                                  function(){
                                 
                                                  },
                                                  function(err){
                                                        console.log("error");
                                                  });
                                random++;
                                IntelliDocs.refillSQLData(d);
                        }
                        else if (d['leaf'] === true)
                        {
                            random++;    
                            tx.executeSql('INSERT INTO intellidocs_folders (u_id,      f_id,      f_fld_item_id, f_item_id, f_folder,      f_name,      f_type,      f_ext,      f_solicitor,      f_attachment,      f_modified,      f_description,      f_file_count, f_folder_count, is_leaf, f_parent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                 [d['u_id'], d['f_id'], 0, d['f_item_id'], d['f_folder'], d['f_name'], d['f_type'], d['f_ext'], d['f_solicitor'], d['f_attachment'], d['f_modified'], d['f_description'], 0, 0, 1, d['f_parent']],
                                 function(){
                                 
                                 },
                                 function(err){
                                          console.log("error");
                                 });
                   
                        }
                    }
                }
            }
            else if (key == 'session') 
            {
                //done.
                IntelliDocs.checkFolderDeletion();
                Ext.getStore('DmtFolderStructureStore').dmtRemoveNotificationsFromServer();
                sqlLoadComplete();
            }
            
        }
        }
    }, function() {
        
    }, function() {});
}

function sqlLoadComplete()
{
    //get current folder info
    var button = Ext.getCmp('dmt-nested-list-back-button');
    var f_id = 0,f_cfolder = '';
    if(!button.isHidden())
    {
        f_id     = button.current_f_id.f_id;
        f_cfolder = button.current_f_id.f_cfolder;
    }
    
    
    setTimeout(function(){
        var str = Ext.getStore('DmtFolderStructureStore');
        db.transaction(function(tx){
                   tx.executeSql("SELECT * FROM intellidocs_folders WHERE f_parent="+f_id,[],
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
                                 
                                 //str.setData({'items' : f_data});
                                 //str.sort([{property:'f_type',direction:'DESC'},{property:'f_ext',direction:'DESC'},{property : 'fld_item_id',direction:'DESC'}]);
                                 IntelliDocs.checkFileOpened(f_data);
                                 Ext.getCmp('dmt-nested-list').unmask();
                            },
                            function(err){
                                    console.log("Error fetching data");
                                    Ext.getCmp('dmt-nested-list').unmask();
                            });
                   });
        },500);
}


var global_file_open_check = [];
IntelliDocs.checkFileOpened = function(f_data)
{
    if(f_data.length == 0)
    {
       Ext.getCmp('dmt-nested-list').getStore().setData({'items' : [] });
    }
    else
    {
        Ext.getCmp('dmt-nested-list').mask();
        IntelliDocs.recursiveFileOpenCheck(f_data,0);
    }
}

IntelliDocs.recursiveFileOpenCheck = function(f_data,index){
    
    
    if(f_data[index].f_type == 'file')
    {
        var file_name_url = f_data[index].f_attachment;
        var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);
        var folder_path = f_data[index].f_folder;
        
        fileSystemRoot.getFile(root_file_path + "/" + folder_path + "/" + file_name,
                               {},
                               function(entry)
                               {
                                    var f = folder_path + "/" + file_name;
                                    console.log("PAth = " + f);
                                    db.transaction(function(tx){
                                              tx.executeSql("SELECT * FROM opened_files WHERE file_path='"+f+"'",
                                                            [],
                                                            function(tx,results){
                                                            
                                                                if(results.rows.length > 0)
                                                                {
                                                                    f_data[index].f_open = 'file_open_class';
                                                                    
                                                                }
                                                                else
                                                                {
                                                                    f_data[index].f_open = '';
                                                                }
                                                                global_file_open_check.push(f_data[index]);
                                                                index++;
                                                                if(index < f_data.length)
                                                                    IntelliDocs.recursiveFileOpenCheck(f_data,index);
                                                            
                                                                if(index == f_data.length)
                                                                {
                                                                    Ext.getCmp('dmt-nested-list').getStore().setData({'items' : global_file_open_check });
                                                                    global_file_open_check = [];
                                                                    Ext.getCmp('dmt-nested-list').unmask();
                                                                }
                                                            
                                                            },function(err){
                                                            
                                                            });
                                              },
                                              function(){},
                                              function(err){});
                               
                                
                               },
                               function(err){
                                f_data[index].f_open = '';
                                global_file_open_check.push(f_data[index]);
                                index++;
                                if(index < f_data.length)
                                    IntelliDocs.recursiveFileOpenCheck(f_data,index);
                               
                                if(index == f_data.length)
                                {
                                    Ext.getCmp('dmt-nested-list').getStore().setData({'items' : global_file_open_check });
                                    global_file_open_check = [];
                                    Ext.getCmp('dmt-nested-list').unmask();
                                }
                               });
    }
    else
    {
        f_data[index].f_open = '';
        global_file_open_check.push(f_data[index]);
        index++;
        if(index < f_data.length)
            IntelliDocs.recursiveFileOpenCheck(f_data,index);
        
        if(index == f_data.length)
        {
            Ext.getCmp('dmt-nested-list').getStore().setData({'items' : global_file_open_check });
            global_file_open_check = [];
            Ext.getCmp('dmt-nested-list').unmask();
        }
    }
    
}

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
    
    
    //NEW CHANGES
    var description = (record_data.f_description == "")?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Description: </span>'+record_data.f_description+'</p>';
    var solicitor 	= (record_data.f_solicitor == "")?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Solicitor: </span>'+record_data.f_solicitor+'</p>';
    var item_id 	= (record_data.f_item_id == null)?'':'<p class="dmt-file-meta-data"><span class="dmt-file-meta-data-field-label">Item Id: </span>'+record_data.f_item_id+'</p>';
    
    switch (record_data.f_type)
    {
        case 'file':
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
                                         text:'Update Folder',
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
            
            var dir_count = record_data.f_sub_fld_count;
            
            
            
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
}
 

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


/**
 * function to check folder deletion on resume
 */
IntelliDocs.checkFolderDeletion = function()
{
    //perform polling here
    var request = new XMLHttpRequest();
    request.open("GET", global_https+"/wp-content/plugins/aj-file-manager-system/includes/ajax_folder_deactivated.php?", true);
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200) 
        { 
            var res_data = eval("(" + request.responseText + ")");
            global_remove_folders = res_data['data'];
            if(global_remove_folders.length > 0)
            { 
                IntelliDocs.remove_directory(global_remove_folders[0].folder); 
            }
        }
    }
    request.send(); 
}

/**
 * get username for currently logged in user
 */
IntelliDocs.dmtGetUsernameFromCache = function()
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
}


IntelliDocs.fileSystemFailCallbck = function(error){
   
}

/**
 * get the file system and create the intellidocs folder
 */
IntelliDocs.fileSystemSuccessCallbck = function(fileSystem){
    // get the root file system object
    fileSystemRoot = fileSystem.root;
    
    //get the full path to root directory
    root_file_path = fileSystem.root.fullPath;
    
    //create intellidocs directory
    fileSystemRoot.getDirectory("intellidocs",
                                {create: true, exclusive: false}, 
                                function(dir){
                                
                                }, 
                                function(err){
                              
                                });
    //set root folder path
    root_file_path += "/intellidocs";
    
    //set the metadata to do not backup
    fileSystemRoot.getDirectory(fileSystemRoot.fullPath,
                                {},
                                function(directory)
                                {
                                    var reader = directory.createReader();
                                    reader.readEntries(function(entries){
                                        for(var i = 0;i<entries.length; i++)
                                        {
                                            entries[i].setMetadata(function(){
                                                                   
                                                                            },function(err){
                                                                            
                                                                            },{"com.apple.MobileBackup":1});
                                        }
                                    });
                                },
                                function(err){
                                    console.log("Do not backup Error");
                                });
}

/**
 * Gets the directory structure for the specified user and creates a file dir_list.js
 * is_not_offline = check to remove masking
 * user_name      = the username to get directory structure for 
 */
IntelliDocs.write_json = function(is_not_offline,user_name,is_on_resume){
    
    var ajax = new XMLHttpRequest();
    
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
                    //clear previous table data
                    db.transaction(function (tx) {
                                   
                                    tx.executeSql('DELETE FROM intellidocs_folders',[],
                                                  function(){
                                                    IntelliDocs.refillSQLData(session_data);
                                                  },
                                                  function(err){
                                                  
                                                  });
                                   },
                                   function(){},
                                   function(){});
                    Ext.getCmp('dmt-nested-list').unmask();
                    
                }
            }
            else
            {
                Ext.getCmp('dmt-nested-list').unmask();
                Ext.Msg.alert('','Failed to read data from server. Please try again');
            }
        }
    };
    
    ajax.open("GET",global_https+"/wp-content/plugins/aj-file-manager-system/includes/ajax_request.php?user_name="+user_name,true);
    ajax.send();
    
}

/**
 * Remove DIrectory and all of its content
 * dir_path = path of directory to be removed
 */            
IntelliDocs.remove_directory = function(dir_path)
{
    fileSystemRoot.getDirectory(root_file_path+ "/" + dir_path,
                                {},
                                function(directory){
                                directory.removeRecursively(function(parent){
                                                            
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
                            global_queued_file_download_complete_count++;
                           
                            if(global_queued_file_download_complete_count == global_queued_file_urls.length)
                            {    
                            //all files downloaded. reset globals here
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
                                Ext.getCmp('dmt-download-progress-folder').destroy();
                                IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,
                                                     Ext.getCmp('dmtFileFolder_count')._value);                                       
                           }
                           else{             
                                IntelliDocs.download_queued_file(global_queued_file_urls[global_queued_file_download_complete_count]);  
                           }
                        },
                        function(err){
                           Ext.getCmp('dmt-dolder-file-name').setHtml(file_name);                                            
                           //trigger file download
                           window.plugins.Download.start(file.url,
                                function(){
                                    global_queued_file_download_complete_count++;
                                    global_download_file_count++;
                                    if(global_queued_file_download_complete_count == global_queued_file_urls.length)
                                    {
                                        //all files downloaded. reset globals here
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
                                        Ext.getCmp('dmt-download-progress-folder').destroy(); 
                                    }
                                    else
                                    {
                                        IntelliDocs.download_queued_file(global_queued_file_urls[global_queued_file_download_complete_count]);  
                                    }
                                    IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,
                                    Ext.getCmp('dmtFileFolder_count')._value);                                              
                                },                                           
                                function(fail){
                                    //something goes wrong. reset global
                                    if(fail.progress == 404)
                                    {
                                        
                                        var filename = global_queued_file_urls[global_queued_file_download_complete_count].url;                                                            filename = filename.substring(filename.lastIndexOf('/')+1); 
                                        
                                        var folder_path = global_queued_file_urls[global_queued_file_download_complete_count].path;
                                        //delete the downloaded file from deveice (376 bytes) 404 page
                                        fileSystemRoot.getFile(root_file_path +"/"+ folder_path + "/" + filename,
                                                               {},
                                                               function(fileEntry){
                                                                    fileEntry.remove();
                                                               },
                                                               function(err){
                                                                                
                                                               });    
                                        global_queued_file_urls = [];
                                        global_queued_file_download_complete_count = 0;
                                        global_current_download_folder_id = 0; 
                                        global_download_file_count=0;    
                                        Ext.getCmp('dmt-download-progress-folder').destroy(); 
                                        IntelliDocs.intellidocs_session_timeout();
                                    }
                                    else
                                    {
                                        if(global_download_file_count > 0)
                                        {
                                            var files = global_download_file_count == 1 ? global_download_file_count + ' file' : global_download_file_count + ' files';
                                            Ext.Msg.alert('Download Failed', files + ' successfully downloaded. Please try again to download remaining files.', Ext.emptyFn);
                                        }
                                        else
                                        {
                                            Ext.Msg.alert('Download Failed!','Please try again!');                                                 
                                        }
                                        global_queued_file_urls = [];
                                        global_queued_file_download_complete_count = 0;
                                        global_current_download_folder_id = 0; 
                                        global_download_file_count=0;
                                        Ext.getCmp('dmt-download-progress-folder').destroy(); 
                                        IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,Ext.getCmp('dmtFileFolder_count')._value);                                            
                                    }
                                },
                                function(info){
                                    var percent = Math.round(info.progress * 100);
                                    document.getElementById('dmt-folder-file-percentage').innerHTML = percent + "%";
                                },
                                root_file_path + '/' + structure);
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
                        if(data['f_id'] == category_id   && data['f_type'] == 'folder')
                        {
                            //set global folder ID
                            global_current_download_folder_id = category_id;
                            
                            //get all file urls
                            IntelliDocs.dmtCreateDirectories(data['f_folder']);
                            IntelliDocs.get_all_leaf_elements(data['items'],subfolder_check);
                            
                            break;
                        }
                        else
                        {
                            IntelliDocs.loop_json(data,category_id, subfolder_check);
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
IntelliDocs.updateFolder = function(category_name)
{
    
	db.transaction(function (tx) {

                   IntelliDocs.dmtCreateDirectories(category_name);
                   
                   tx.executeSql("SELECT * FROM intellidocs_folders WHERE f_type='file' AND f_folder='"+ category_name +"'",
                                 [],
                                 function(tx,results){
                                               
                                               var len = results.rows.length;
                                               
                                               for (var i=0; i<len; i++)
                                               {
                                                    global_queued_file_urls.push({
                                                                            url : results.rows.item(i).f_attachment,
                                                                            path: results.rows.item(i).f_folder});
                                               }
                                               
                                               if(global_queued_file_urls.length > 0)
                                               {
                                                    //trigger the bulk file download
                                                    IntelliDocs.download_queued_file(global_queued_file_urls[0]);
                                               }
                                               else{
                                                    global_queued_file_urls = [];
                                                    global_queued_file_download_complete_count = 0;
                                                    global_current_download_folder_id = 0;
                                               }
                                               },
                                               function(err){
                                                    console.log( "Error processing SQL: " + err.code );
                                               });
                                 },
                                 function(err){
                                    console.log( "Error processing SQL: " + err.code );
                                 });
}

/**
 * loop through dir_list.js and find all the files to be downloaded
 * _json_obj = initially dir_list.js
 * category_id = objec to search for
 * function
 */
IntelliDocs.updateAllFolders = function()
{
    
	db.transaction(function (tx) {
                   
                   tx.executeSql("SELECT DISTINCT(f_folder) FROM intellidocs_folders", [], function(tx,res){
                                 
                                 var len = res.rows.length;
                                 for (var i=0; i<len; i++)
                                 {
                                    IntelliDocs.dmtCreateDirectories(res.rows.item(0).f_folder);
                                 }
                                 
                                 tx.executeSql("SELECT f_attachment,f_folder FROM intellidocs_folders WHERE f_type='file'", [], function(tx,results){
                                               
                                               var len = results.rows.length;
                                               
                                               for (var i=0; i<len; i++)
                                               {
                                               global_queued_file_urls.push({
                                                                            url : results.rows.item(i).f_attachment,
                                                                            path: results.rows.item(i).f_folder});
                                               }
                                               
                                               if(global_queued_file_urls.length > 0)
                                               {
                                               //trigger the bulk file download 
                                               IntelliDocs.download_queued_file(global_queued_file_urls[0]);
                                               }
                                               else{
                                               global_queued_file_urls = [];
                                               global_queued_file_download_complete_count = 0;
                                               global_current_download_folder_id = 0;
                                               }
                                               },
                                               function(err){
                                               console.log("Error processing SQL: "+err.code);
                                               });
                                 },
                                 function(err){
                                 console.log("Error processing SQL: "+err.code);
                                 });
                   
                   }, 
                   function(){},
                   function(){});
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
            IntelliDocs.dmtCreateDirectories(data['f_folder']);
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
                global_queued_file_urls.push({
                                             url : data['f_attachment'],
                                             path: data['f_folder']
                                             });
            }
        }
    }
    
    if(global_queued_file_urls.length > 0)
    {
        //trigger the bulk file download 
        IntelliDocs.download_queued_file(global_queued_file_urls[0]);
    }
    else{
        //we are not triggering file download. reset globals
        Ext.getCmp('dmt-download-progress-folder').destroy();
        global_queued_file_urls = [];
        global_queued_file_download_complete_count = 0;
        global_current_download_folder_id = 0;
    }
} 


IntelliDocs.getFolderMeta = function(folder_path,total_files)
{
    var meta = '';
    var files_present = 0;
    var remaining_files = 0;
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
                                                
                                                remaining_files = (total_files == files_present) ? 0 : (total_files - files_present < 0 ? 0 :  total_files - files_present);
                                                       files_present   = total_files < files_present ? total_files : files_present;
                                
                                                   meta = "Total Files: " + total_files +"/ Downloaded Files: " + files_present + "/ Remaining Files: " + remaining_files;
                                                   Ext.getCmp('dmt-folder-metadata').setHtml(meta);
                                                       },
                                                   function(err){
                                                   
                                                   });
                                },
                                function(err)
                                {
                                //if directory doesn't exists
                                meta = "Total Files: " + total_files +"/ Downloaded Files: 0 / Remaining Files: " + total_files;
                                Ext.getCmp('dmt-folder-metadata').setHtml(meta);  
                                });
    
    
}


/**
 * create directories
 */
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
        
        fileSystemRoot.getDirectory(root_file_path + "/" + dir_path,
                                    {create: true, exclusive: false}, 
                                    function(dir){
                                    }, 
                                    function(err){
                                    });
        
    }  
}

IntelliDocs.downloadFile = function(record)
{
    if(navigator.onLine)
    {
        
        var file_url = record.getData().f_attachment; 
        var file_name = file_url.substring(file_url.lastIndexOf('/')+1);
        
        var progress_bar_panel_config = 
        {
        id:'dmt-download-progress',   
        minWidth:300,
        minHeight:200,
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
        
        
        Ext.Viewport.add(Ext.create('Ext.Panel',progress_bar_panel_config)).show({type:'pop',duration:250,easing:'ease-out'});	
        
        
        var structure = record.getData().f_folder;
        
        
        IntelliDocs.dmtCreateDirectories(structure);
        
        //trigger the file download plugin
        window.plugins.Download.start(file_url,
                                      function(){
                                        Ext.getCmp('dmt-download-progress').destroy();
                                        Ext.getCmp('dmt-file-action-button').setText('Open');                                                   
                                        window.plugins.openfile.viewFile("file://" + root_file_path + "/" +  structure +"/"+ file_name);
                                        IntelliDocs.markFileOpened(structure +"/"+ file_name);
                                      },
                                      function(fail){
                                        if(fail.progress == 404)
                                        {
                                            //delete the downloaded file from deveice (376 bytes) 404 page
                                            fileSystemRoot.getFile(root_file_path +"/"+ structure + "/" + file_name,
                                                             {},
                                                             function(fileEntry){
                                                                fileEntry.remove();
                                                                
                                                             },
                                                             function(err){
                                                             
                                                             });                                            
                                            Ext.getCmp('dmt-download-progress').destroy(); 
                                            IntelliDocs.intellidocs_session_timeout();
                                        }
                                        else
                                        {
                                            Ext.getCmp('dmt-download-progress').destroy(); 
                                            Ext.Msg.alert('Download Failed!','Please try again!'); 
                                        }
                                      },
                                      function(info){
                                        var percent = Math.round(info.progress * 100);
                                        
                                        document.getElementById('percentage').innerHTML = percent + '%';
                                      },
                                      root_file_path + '/' + structure);
    }
    else
    {
        Ext.Msg.alert('Offline','You are currently offline');
    }
}

IntelliDocs.markFileOpened = function(filePath)
{
    console.log("ENter here");
    db.transaction(function(tx){
                    tx.executeSql("SELECT * FROM opened_files WHERE file_path='"+filePath+"'",
                                  [],
                                  function(tx,results){
                                  
                                    if(results.rows.length == 0)
                                    {
                                        tx.executeSql("INSERT INTO opened_files(file_path) VALUES (?)",
                                                      [filePath]);
                                    }
                                  
                                  },function(err){
                                  
                                  });
                  },
                  function(){},
                  function(err){});
}
