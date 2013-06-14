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
    	if(Ext.device.Connection.isOnline())
        {
           var folder_id = 0;
           Ext.Msg.confirm('','Download all documents from your IntelliDocs server? This action might take long time.',
                           function(buttonId){
                           if(buttonId == 'yes')
                           {
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

	                   // var file_name_url = button.getParent().getComponent(0).getComponent(0).getValue();
	                	var fileUrlField  = Ext.ComponentQuery.query('hiddenfield[name="document_url"]');
	            		var file_name_url = fileUrlField.pop().getValue(); 
	                    var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);   
	                    var structure = Ext.getCmp('dmtFileFolder')._value;
	                    
	                    fileSystemRoot.getFile(root_file_path +"/"+ structure + "/" + file_name,
	                                              {},
	                                              function(fileEntry){
	                                            	  console.log("file deleted");	
	                                            	  fileEntry.remove();  
	                                            	  Ext.getCmp('dmt-file-action-button').setText('Download File?');
	                                            	  //Ext.getCmp('dmt-file-action-button').setAction('dmtDetailsPanelDownloadButton');
	                                            	  button.destroy();
	                                              },
	                                              function(err){
	                                                                            
	                                              });
	            	}
    			});
            	
    },
    //The folder download function.
    dmtDetailsPanelFolderDownloadButtonTap:function(button)
    {
        if(Ext.device.Connection.isOnline())
        {
        	var folder_name = Ext.getCmp('dmtFileFolderPath')._value;
        	var folder_id  = Ext.getCmp('dmtFileFolderId')._value;
        	Ext.Msg.confirm('','Update the current folder with the latest documents from your server?',
                           function(buttonId){
                           if(buttonId == 'yes')
                           {
                        	   IntelliDocs.updateFolder(folder_name,folder_id);
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
    dmtDetailsPanelOpenButtonTap:function(button){
    	
    	if(button.getText() == 'Download File?')
        {
            this.dmtDetailsPanelDownloadButtonTap(button);
            return;
        }
    	
		
        //get the file name to be displayed
        //var file_name_url = button.getParent().getComponent(0).getComponent(0).getValue(); 
    	var fileUrlField  = Ext.ComponentQuery.query('hiddenfield[name="document_url"]');
		var file_name_url = fileUrlField.pop().getValue(); 
        var file_name = file_name_url.substring(file_name_url.lastIndexOf('/')+1);             
        
        var structure = Ext.getCmp('dmtFileFolder')._value;
        
        window.openFile( root_file_path + "/" + structure +"/"+ file_name);
        IntelliDocs.markFileOpened(structure +"/"+ file_name);
        /** iOS file Open code */
        //window.plugins.openfile.viewFile(root_file_path + "/" + structure +"/"+ file_name);
           
    },
    dmtDetailsPanelDownloadButtonTap:function(button)
	{
        if(Ext.device.Connection.isOnline())
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
        		var fileUrlField  = Ext.ComponentQuery.query('hiddenfield[name="document_url"]');     		
                //var file_url = button.getParent().getComponent(0).getComponent(0).getValue(); 
        		var file_url = fileUrlField.pop().getValue(); 
                var file_name = file_url.substring(file_url.lastIndexOf('/')+1);
                
                
                var fileProgressPanel = Ext.create('Ext.LoadMask',{
            		id:'file-download-mask',
            		indicator: true,
            		html: '<p>'+ file_name +'</p><p>Downloading...</p><p id="dmt-file-percent"></p>',
            		message:''
                });
                Ext.Viewport.add(fileProgressPanel);
                
               
                
                var structure = Ext.getCmp('dmtFileFolder')._value;
                
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
                			}, 
                			function(err){
                				console.log(err.code + 'Folder exists. Lets check next');
                			});

                }   
                
                var fileDownloadTask = Ext.create('Ext.util.DelayedTask', function() { 

                	//trigger the file download plugin
                	window.downloadFile(file_url,
                			{
                		dirName: root_file_path + '/' + structure,
                		overwrite: false
                			}, 
                			function(res) {
                				var percent = Math.round(res.progress);

                				if(percent == 100)
                				{
                					console.log("File Downloaded");
                					button.setText('Open');
                					Ext.getCmp('file-download-mask').destroy();
                					//button.setAction('dmtDetailsPanelOpenButton');
                				}
                			},
                			function(error) {
                				console.log("Download failed:" + error);
                				Ext.getCmp('file-download-mask').destroy();
                				Ext.Msg.alert('Download Failed!','Please try again!');

                			}
                	);
                });
                
                fileDownloadTask.delay(300);

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