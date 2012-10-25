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


var global_is_user_logged_in = false;

//global app version
var global_app_version = 'Version : 1.0.3';

//global http vars. switch server with ease
//var global_https = "https://www.intellidocs.net";
var global_https = "https://www.press-port.com";

/**
 * the main device ready event
 * (starting point for the phonegap app)
 */
document.addEventListener('deviceready',function(){
                          //request a file system
                          window.requestFileSystem(LocalFileSystem.PERSISTENT,
                                                   0,
                                                   IntelliDocs.fileSystemSuccessCallbck,
                                                   IntelliDocs.fileSystemFailCallbck);  
                          
                          /*
                           * check deleted folders on resume
                           */
                          document.addEventListener('resume',function(){
                                                if(navigator.onLine)
                                                {
                                                    if(IntelliDocs.dmtGetUsernameFromCache() != '')
                                                    {
                                                        IntelliDocs.write_json(true,IntelliDocs.dmtGetUsernameFromCache(),true);
                                                        Ext.getCmp('dmt-nested-list').mask({xtype:'loadmask'});                                     
                                                    }                                          
                                                }   
                                            });
                          },false);



/**
  * check if file is downloaded in any other folder 
  *
IntelliDocs.checkFileExistOnDevice = function(folder_paths,file_name)
{
    var file_exists_on_device = false;
    var folder_path = '';
    
    
    for(var i = 0; i < folder_paths.length;i++)
    {
        
        fileSystemRoot.getFile(root_file_path+"/"+folder_paths[i]+"/"+file_name,
                            {},
                            function(fileEntry){
                               file_exists_on_device = true; 
                               folder_path = folder_paths[i];
                            },
                            function(err){
                               //console.log("");                              
                            });  
        
        if(file_exists_on_device)
            break;
    }  
    
    console.log("checking for file: "+ folder_path + String(file_exists_on_device));
    
    return { 
             'file_exists' : file_exists_on_device,
             'folder_path' : folder_path
           };
    
}*/   

IntelliDocs.intellidocs_session_timeout = function(controller)
{
    Ext.Msg.alert('Session Expired','Your session on the server has expired.Please login in again.');
    controller.getApplication().getController('DmtSettingsController').dmtSecureLoginLogout();
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



/**
 * function to check folder deletion on resume
 */
IntelliDocs.checkFolderDeletion = function()
{
    console.log('check for folder deleteion now');
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
    console.log("error: Failed to load the file system");
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
                                console.log(err.code + 'Folder exists.');
                                });
    //set root folder path
    root_file_path += "/intellidocs";
}

/**
 * Gets the directory structure for the specified user and creates a file dir_list.js
 * is_not_offline = check to remove masking
 * user_name      = the username to get directory structure for 
 */
IntelliDocs.write_json = function(is_not_offline,user_name,is_on_resume){
    var ajax = new XMLHttpRequest();
    ajax.open("GET",global_https+"/wp-content/plugins/aj-file-manager-system/includes/ajax_request.php?user_name="+user_name,true);
    ajax.send();
    
    ajax.onreadystatechange = function()
    {
        if(ajax.readyState == 4)
        {    
            if(ajax.status == 200)
            {
                var data_to_write = ajax.responseText;
                //got the file data. get the dir_list.js file. 
                fileSystemRoot.getFile('dir_list.js', 
                                       {create: true}, 
                                       function(fileEntry) {
                                       // Create a FileWriter object for our FileEntry.
                                       fileEntry.createWriter(function(fileWriter) {
                                                              fileWriter.onwrite = function(e) {
                                                              console.log('JS file Write completed.');
                                                              //set global app launch to false
                                                              DMTApp.launched = false;
                                                              
                                                              if(is_not_offline)
                                                              {
                                                              Ext.getStore('DmtFolderStructureStore').load();
                                                              Ext.getStore('DmtFolderStructureStore').dmtRemoveNotificationsFromServer();
                                                              Ext.getCmp('dmt-nested-list').unmask(); 
                                                              }
                                                              if(is_on_resume)
                                                              {
                                                              IntelliDocs.checkFolderDeletion();
                                                              }
                                                              
                                                              };
                                                              fileWriter.write(data_to_write);
                                                              }, 
                                                              function(e){
                                                              console.log('Error', e);
                                                              });
                                       },function(e){
                                       console.log('Error', e);
                                       });
            }
            else
            {
                Ext.getCmp('dmt-nested-list').unmask();
                Ext.Msg.alert('','Failed to read data from server. Please try again');
            }
        }
    };              
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
                                console.log('Directory doesn\'t exists'+ err.code);
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
                           console.log('All files downloaded');
                           if(global_download_file_count == 0)
                           {
                           Ext.Msg.alert('', 'All files have already been downloaded', Ext.emptyFn);   
                           }
                           else
                           {   
                           var files = global_download_file_count == 1 ? global_download_file_count + ' file' : global_download_file_count + ' files';
                           Ext.Msg.alert('', files + ' successfully downloaded', Ext.emptyFn);
                           }                                                 global_queued_file_urls = [];
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
                           console.log('doesn\'t exists' + err.code);
                           Ext.getCmp('dmt-dolder-file-name').setHtml(file_name);                                            //trigger file download
                           window.plugins.Download.start(file.url,
                                                         function(){
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
                                                         Ext.getCmp('dmt-download-progress-folder').destroy(); 
                                                         }
                                                         else{             
                                                         IntelliDocs.download_queued_file(global_queued_file_urls[global_queued_file_download_complete_count]);  
                                                         }
                                                         IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,
                                                                                   Ext.getCmp('dmtFileFolder_count')._value);                                              
                                                         },                                           
                                                         function(fail){
                                                         //something goes wrong. reset globals
                                                         console.log("Download failed:" + fail.status);
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
                                                         
                                                         IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,
                                                                                   Ext.getCmp('dmtFileFolder_count')._value);                                            
                                                         },
                                                         function(info){
                                                         console.log(info.progress);
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
                            //match found. now get all leaf nodes from items array
                            console.log(data['f_name'] + ' Found the category element');
                            
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
        console.log('Files count: ' + global_queued_file_urls.length);
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
    console.log(folder_path);
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
                                                   
                                                   remaining_files = (total_files == files_present) ? 0 : (total_files - files_present);
                                                   meta = "Total Files: " + total_files +"/ Downloaded Files: " + files_present + "/ Remaining Files: " + remaining_files;
                                                   Ext.getCmp('dmt-folder-metadata').setHtml(meta);                                                               },
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
                                    console.log('Dir created');
                                    }, 
                                    function(err){
                                    console.log(err.code + 'Folder exists. Lets check next');
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
                                      console.log("File Downloaded");
                                      Ext.getCmp('dmt-download-progress').destroy();
                                      Ext.getCmp('dmt-file-action-button').setText('Open');                                                   
                                      window.plugins.openfile.viewFile("file://" + root_file_path + "/" +  structure +"/"+ file_name);
                                      },                                           
                                      function(fail){
                                      console.log("Download failed:" + fail);
                                      Ext.getCmp('dmt-download-progress').destroy(); 
                                      Ext.Msg.alert('Download Failed!','Please try again!');                                             
                                      },
                                      function(info){
                                      var percent = Math.round(info.progress * 100);
                                      console.log('File downloaded:' + info.progress);
                                      document.getElementById('percentage').innerHTML = percent + '%';
                                      },
                                      root_file_path + '/' + structure);
    }
    else
    {
        Ext.Msg.alert('Offline','You are currently offline');
    }
}         