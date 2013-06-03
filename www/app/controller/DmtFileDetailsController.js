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
           
           Ext.Msg.confirm('','Download all documents from your IntelliDocs server? This action might take long time.',
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
                           IntelliDocs.updateAllFolders(); 
                           
                           }
                           else
                           {}
                        });
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
                                                                          button.destroy();
                                                                          IntelliDocs.getFolderMeta(Ext.getCmp('dmtFileFolderPath')._value,Ext.getCmp('dmtFileFolder_count')._value);
                                                                          },
                                                                          function(err){
                                                                          
                                                                          });
                                                       },
                                                       function(err)
                                                       {
                                                       //if directory doesn't exists
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
                                                   	
                                                    fileEntry.remove();
                                                    button.destroy();
                                                    Ext.getCmp('dmt-file-action-button').setText('Download File?');
	                                              },
	                                              function(err){
                                                    
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
           
            Ext.Msg.confirm('','Update the current folder with the latest documents from your server?',
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
                                
                                IntelliDocs.updateFolder(folder_id);
                           }
                });
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
							xtype:  'panel',
							html:   '<div id="loading-container">'+
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
                
                var structure = Ext.getCmp('dmtFileFolder')._value;
                
                
                IntelliDocs.dmtCreateDirectories(structure);
                
                
                 //trigger the file download plugin
                window.plugins.Download.start(file_url,
                                            function(){
                                                Ext.getCmp('dmt-download-progress').destroy(); 
                                                button.setText('Open');
                                                button.setAction('dmtDetailsPanelOpenButton');
                                    
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