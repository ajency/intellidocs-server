Ext.define('DMTApp.controller.DmtFileDetailsController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
           dmtDetailsPanelDownloadButton:'button[action=dmtDetailsPanelDownloadButton]',
           dmtDetailsPanelOpenButton:'button[action=dmtDetailsPanelOpenButton]',  
           //Add new button reference
           dmtDetailsPanelFolderDownloadButton:'button[action=dmtDetailsPanelFolderDownloadButton]',
           dmtDetailsPanelDeleteButton : 'button[action=dmtDetailsPanelDeleteButton]',
           dmtDetailsPanelSubFolderDownloadButton : 'button[action=dmtDetailsPanelSubFolderDownloadButton]',
           dmtDetailsPanelFolderDeleteFilesButton : 'button[action=dmtDetailsPanelFolderDeleteFilesButton]'           
        },
        control: {
			dmtDetailsPanelDownloadButton:
			{
				tap:'dmtDetailsPanelDownloadButtonTap'
           },
           dmtDetailsPanelOpenButton:
           {
                tap:'dmtDetailsPanelOpenButtonTap'
           },
           //Add folder download tap event.
           dmtDetailsPanelFolderDownloadButton:
           {
           tap:'dmtDetailsPanelFolderDownloadButtonTap'
           },
           dmtDetailsPanelDeleteButton:
       	   {
                tap:'dmtDetailsPanelDeleteButtonTap'   
           },
           dmtDetailsPanelSubFolderDownloadButton:
           {
                tap : 'dmtDetailsPanelSubFolderDownloadButtonTap'
           },
           dmtDetailsPanelFolderDeleteFilesButton:
           {
                tap:'dmtDetailsPanelFolderDeleteFilesButtonTap'   
           }           
        }
    },
    dmtDetailsPanelSubFolderDownloadButtonTap:function(button)
    {
        if(navigator.onLine)
        {
           var folder_id = Ext.getCmp('dmtFileFolderId')._value;
           
           if(global_current_download_folder_id == 0)
           {
           
                Ext.Msg.confirm('','Download all files in sub folder also? This action might take long time.',
                           function(buttonId){
                           if(buttonId == 'yes')
                           {
                           var progress_bar_panel_config_folder = 
                           {
                           id:'dmt-download-progress-folder',   
                           minHeight:300,
                           minWidth: 200,
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
                           [{
                            xtype:'titlebar',
                            docked:'top',
                            title:'Downloading File'
                            },
                            {
                            xtype:'panel',
                            html:"Folder",
                            id:'dmt-dolder-file-name' 
                            },
                            {
                            xtype:'panel',
                            html:'<div id="loading-container">'+
                            '<div id="loading-box">'+
                            '<div id="loading-bar">'+
                            '<div id="dmt-folder-file-percentage"></div>'+
                            '</div>'+
                            '</div>'+
                            '</div>',										
                            }]
                           } 
                           
                           Ext.Viewport.add(Ext.create('Ext.Panel',progress_bar_panel_config_folder)).show({type:'pop',duration:250,easing:'ease-out'});	
                           
                           var request = new XMLHttpRequest();
                           request.open("GET", "file://"+ root_file_path.substr(0,root_file_path.length - 11) + "dir_list.js", true);
                           request.onreadystatechange = function(){
                           if (request.readyState == 4) {
                           if (request.status == 200 || request.status == 0) {
                           IntelliDocs.loop_json( eval(request.responseText) , folder_id , true);
                           }
                           }
                           }
                           request.send();            
                           }
                           else
                           {}
                           });
                }
                else if(global_current_download_folder_id = folder_id)
                {
                    Ext.Msg.alert('Please Wait','Currently downloading files from this directory');
                }
                else{
                    Ext.Msg.alert('Please Wait','Until current download ends');
                }
           }
           else
           {
                Ext.Msg.alert('Offline','You are currently offline');
           }
    },
    dmtDetailsPanelFolderDeleteFilesButtonTap : function(button)
    {
           Ext.Msg.confirm('','Delete all the files from this folder?',
                           function(buttonId){
                           if(buttonId == 'yes')
                           {
                           var folder_path = Ext.getCmp('dmtFileFolderPath')._value;
                           
                           fileSystemRoot.getDirectory(root_file_path + "/"+ folder_path,
                                                       {},
                                                       function(directory)
                                                       {
                                                       var reader = directory.createReader();
                                                       reader.readEntries(function(entries){
                                                                          for(var i = 0;i<entries.length; i++)
                                                                          {
                                                                            if(entries[i].isFile)
                                                                            {
                                                                                entries[i].remove(); 
                                                                            }
                                                                          
                                                                          }
                                                                          
                                                                          //deleted all files
                                                                          console.log("all files deleted")
                                                                          button.destroy();
                                                                          IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,Ext.getCmp('dmtFileFolder_count')._value);
                                                                          },
                                                                          function(err){
                                                                          
                                                                          });
                                                       },
                                                       function(err)
                                                       {
                                                       //if directory doesn't exists
                                                       console.log('Failed to read files');
                                                       });	
                           }
                           });
    },
    dmtDetailsPanelDeleteButtonTap : function(button)
    {
        Ext.Msg.confirm('','Delete this file from device?',
                        function(buttonId){
                        if(buttonId == 'yes')
                        {
                           var file_name_url = button.getParent().getComponent(0).getComponent(0).getValue();   
                           var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);   
                           var structure = Ext.getCmp('dmtFileFolder')._value;
                           
                           fileSystemRoot.getFile(root_file_path +"/"+ structure + "/" + file_name,
	                                              {},
	                                              function(fileEntry){
                                                    console.log("file deleted");	
                                                    fileEntry.remove();
                                                    button.destroy();
                                                    Ext.getCmp('dmt-file-action-button').setText('Download File?');
	                                              },
	                                              function(err){
                                                    console.log("Unable to delete file. " + err.code);
	                                              });
                        }
                    });
           
    },           
    //The folder download function.
    dmtDetailsPanelFolderDownloadButtonTap:function(button)
    {
        if(navigator.onLine)
        {
           var folder_id = Ext.getCmp('dmtFileFolderId')._value;
           
           if(global_current_download_folder_id == 0)
           {
               
                Ext.Msg.confirm('','Download all files in current folder?',
                           function(buttonId){
                           if(buttonId == 'yes')
                           {
                                var progress_bar_panel_config_folder = 
                                {
                                    id:'dmt-download-progress-folder',   
                                    minHeight:300,
                                    minWidth: 200,
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
                                        [{
                                            xtype:'titlebar',
                                            docked:'top',
                                            title:'Downloading File'
                                         },
                                         {
                                            xtype:'panel',
                                            html:"Folder",
                                            id:'dmt-dolder-file-name' 
                                         },
                                         {
                                            xtype:'panel',
                                            html:'<div id="loading-container">'+
                                                    '<div id="loading-box">'+
                                                        '<div id="loading-bar">'+
                                                            '<div id="dmt-folder-file-percentage"></div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>',										
                                         }]
                                } 
                                
                                Ext.Viewport.add(Ext.create('Ext.Panel',progress_bar_panel_config_folder)).show({type:'pop',duration:250,easing:'ease-out'});	
                                
                                var request = new XMLHttpRequest();
                                request.open("GET", "file://"+ root_file_path.substr(0,root_file_path.length - 11) + "dir_list.js", true);
                                request.onreadystatechange = function(){
                                    if (request.readyState == 4) {
                                        if (request.status == 200 || request.status == 0) {
                                            IntelliDocs.loop_json(eval(request.responseText),folder_id);
                                        }
                                    }
                                }
                                request.send();            
                           }
                           else
                           {}
                           });
           }
           else if(global_current_download_folder_id = folder_id)
           {
               Ext.Msg.alert('Please Wait','Currently downloading files from this directory');
           }
           else{
               Ext.Msg.alert('Please Wait','Until current download ends');
           }
           
        }
        else
        {
           Ext.Msg.alert('Offline','You are currently offline');
        }
    },
    dmtDetailsPanelOpenButtonTap:function(button){
           
        if(button.getText() == 'Download File?')
        {
           this.dmtDetailsPanelDownloadButtonTap(button);
           return;
        }           
        //get the file name to be displayed
        var file_name_url = button.getParent().getComponent(0).getComponent(0).getValue();   
        var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);             
        
        var structure = Ext.getCmp('dmtFileFolder')._value;
        window.plugins.openfile.viewFile("file://" + root_file_path + "/" +  structure +"/"+ file_name);
           
    },
    dmtDetailsPanelDownloadButtonTap:function(button)
	{
        if(navigator.onLine)
        {
    
        if(button.getText() == 'Open')
        {
            this.dmtDetailsPanelOpenButtonTap(button);
            return;
        }
        
        Ext.Msg.confirm('','Download File?',
		function(buttonId){
			if(buttonId == 'yes')
            {
                //get file url        
                var file_url = button.getParent().getComponent(0).getComponent(0).getValue(); 
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
				console.log(button.getParent().getComponent(0).getComponent(0).getValue());
				
                       
				Ext.Viewport.add(Ext.create('Ext.Panel',progress_bar_panel_config)).show({type:'pop',duration:250,easing:'ease-out'});	
                
                
                var structure = Ext.getCmp('dmtFileFolder')._value;
                
                
                IntelliDocs.dmtCreateDirectories(structure); 
                
                //trigger the file download plugin
                window.plugins.Download.start(file_url,
                                            function(){
                                                console.log("File Downloaded");
                                                Ext.getCmp('dmt-download-progress').destroy(); 
                                                button.setText('Open');
                                                button.setAction('dmtDetailsPanelOpenButton');
                                    
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
				console.log('Clicked No');
			}
    });
    }
	else
    {
          Ext.Msg.alert('Offline','You are currently offline');
    }
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});