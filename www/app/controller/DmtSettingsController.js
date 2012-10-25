Ext.define('DMTApp.controller.DmtSettingsController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			//Used the button action due to instantiation problem.
			dmtSettingsPanel				:'.dmtsettings',
			dmtSettingsPanelChangePassword	:'.togglefield[id=dmt-settings-panel-change-password]',
			dmtSettingsPanelLogout			:'.togglefield[id=dmt-settings-panel-logout]',
			dmtChangePasswordFormButton		:'button[action=dmtChangePasswordPanelButton]',
            dmtSettingsDeleteAllButton 		:'button[action=dmtSettingsDeleteAllButton]'		
        },
        control: {
			dmtSettingsPanel:
			{
				initialize:'dmtSettingsPanelLoad',
			},
			dmtSettingsPanelChangePassword:
			{
				change:'dmtSettingsPanelChangePasswordChange'
			},
			dmtSettingsPanelLogout:
			{
				change:'dmtSettingsPanelLogoutChange'
			},
			dmtChangePasswordFormButton:
			{
				tap:'dmtChangePasswordFormButtonTap',
            },
            dmtSettingsDeleteAllButton:
            {
                tap : 'dmtSettingsDeleteAllButtonTap'
            }
        }
    },
    dmtSettingsDeleteAllButtonTap :function()
    {
        Ext.Msg.confirm('','This action will remove all downloaded files from device permanantly. Do you wish to continue?',
            function(buttonId){
            if(buttonId == 'yes')
            {
                fileSystemRoot.getDirectory(root_file_path,
                    {},
                    function(directory){
                        directory.removeRecursively(function(parent){
                        console.log("Application root folder deleted");
                                                    
                        //create intellidocs directory again for next actions
                        fileSystemRoot.getDirectory(root_file_path,
                                                {create: true, exclusive: false}, 
                                                function(dir){
                                                    console.log("INtellidocs folder created again ");
                                                    var sub_tabs_panel = Ext.getCmp('dmt-sub-tabs-panel');
                                                    sub_tabs_panel.setActiveItem(0);
                                                }, 
                                                function(err){
                                                    console.log(err.code + 'Folder exists.');
                                                });
                                            },
                                            function(err){
                                                console.log("Application failed to delete root folder");
                                            });
                                        },
                                        function(err){
                                            console.log("Error reading intellidocs folder");
                                        });
            }
        });	
    },
    dmtSettingsPanelLoad:function()
	{
		var user_details = this.dmtGetUsernameEmailFromCache();
		console.log(user_details);
		Ext.getCmp('dmt-settings-panel-user-name').setValue(user_details[0]);
		Ext.getCmp('dmt-settings-panel-user-email').setValue(user_details[1]);
	},
	dmtSettingsPanelChangePasswordChange:function( current,slider,thumb,newValue,oldValue, eOpts )
	{
		if(newValue == 1)
		{
			var details_container = Ext.getCmp('dmt-details-container');
			details_container.add(Ext.create('DMTApp.view.DmtTabsPanel.DmtDetailsPanel.DmtChangePasswordPanel')).show({type:'pop',duration:250,easing:'ease-out'});
		}
		else
		{
			if( Ext.getCmp('dmt-change-password-panel'))
				 Ext.getCmp('dmt-change-password-panel').destroy();
		}
	},
	//Function on change of the toggle for logout
	dmtSettingsPanelLogoutChange:function( current,slider,thumb,newValue,oldValue, eOpts )
	{
		//Check the toggle value and perform the action
		if(newValue == 1)
		{
			Ext.Msg.confirm('Logout','Are you sure you want to logout?',
			function(buttonId){
			if(buttonId == 'yes')
			{
				this.dmtSecureLoginLogout();
				var main_container = Ext.getCmp('dmt-main-container');
               
				
				//To create a new instance of the secure login destroy the old one if it exists.
				if(Ext.getCmp('dmt-secure-login-panel'))
					Ext.getCmp('dmt-secure-login-panel').destroy();				
					
				var dmt_secure_login_panel = Ext.create('DMTApp.view.DmtSecureLogin');
					main_container.setActiveItem(dmt_secure_login_panel);
				
				//Disconnect the notification polling and release the resources/		
				var notification_polling = Ext.direct.Manager.getProvider('dmt-notification-polling');
				notification_polling.disconnect();
                //Ext.Viewport.unmask();
                Ext.Ajax.request({
                        url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_user_logout.php',
                                             callbackKey: 'set_user_logout',
                                             method:'POST',
                                             withCredentials: true,
                                             useDefaultXhrHeader: false,
                                             
                                             success: function(result, request)
                                             {
                                                console.log(result);
                                             },
                                             failure: function(result)
                                             {
                                                console.log(result);
                                             },
                                             scope :this,
                                });	
            }
			else
				current.reset();
			},this);
		}
	},
	dmtChangePasswordFormButtonTap:function(button)
	{
		var change_password_form = Ext.getCmp('dmt-change-password-panel');
		var field_values = change_password_form.getValues();
		var change_password_model_config = {
												old_password	:field_values.dmt_old_password, 
												new_password	:field_values.dmt_new_password, 
												cnf_new_password:field_values.dmt_new_re_password,
											};
		var change_password_model = Ext.create('DMTApp.model.ChangePasswordFormModel',change_password_model_config);
		var errors = change_password_model.validate();
		
		var user_details = this.dmtGetUsernameEmailFromCache();
		if(errors.isValid())
		{
			if(field_values.dmt_new_re_password == field_values.dmt_new_password)
			{
				Ext.Viewport.mask({xtype:'loadmask',message:'Changing password...'});
				Ext.data.JsonP.request({
				url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_user_retrieve_password.php',
				callbackKey:'dmt_change_password',
				params:
				{
					user_login:user_details[0],
					password_action_type:'change_password',
					old_pass:field_values.dmt_old_password,
					new_pass:field_values.dmt_new_password,
				},
				success: function(response, opts) {
					Ext.Viewport.unmask();
						if(response.response == false)
						{
							switch(response.error_code)
							{
								case 0: //No user name present
									Ext.Msg.alert('Oops...','The username or password provided is not valid');
								break;
							}
						}
						else if( response.response == true)
						{
							switch(response.error_code)
							{
								case 3: //Password email could not be sent
										Ext.Msg.alert('Oops...','Your password has been changed, But the email containg your new password could not be sent!.');
								break;
								
								default:
										Ext.Msg.alert('Password Changed','Your password has been changed, The new password has been sent to your registered email account');
							};	
							change_password_form.reset();
						}
						console.log(response);
					},
				failure: function(response, opts) {
						Ext.Viewport.unmask();
						Ext.Msg.alert('Oops...','Someting seems to have gone wrong. Try  again later');
						console.log(response);
					}
				});
			}
			else
			{	
				Ext.Viewport.unmask();
				Ext.Msg.alert('Password Mismatch','The new passwords provided do not match.');
			}
		}
		else
		{	
			var all_errors = '';		
			Ext.Array.each(	errors.items,function(item,key){all_errors += item._message+'<br>';});
			Ext.Msg.alert('The following fields had errors',all_errors);	
		}
	},
    dmtSecureLoginLogout:function()
	{
			var login_info_store = Ext.getStore('DmtLocalStorageCookie');
			login_info_store.load();
			
			var index = login_info_store.find('key','dmtScLgInfo');
		
		console.log(index);
			
			if(index == -1)
			{
				//setup localstorage with values
				var record = Ext.create('DMTApp.model.DmtLocalStorageCookieModel', {key: 'dmtScLgInfo',value: 'loggedOutSuccessfully',user_name:''});
				record.save();					
			}
			else
			{
				//Get the old value and set new value
				var record = login_info_store.getAt(index);
				record.set('value','loggedOutSuccessfully');
				record.set('user_name','');
				record.save();
			}
	
	},
	dmtGetUsernameEmailFromCache:function()
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
			return Array(stored_data.user_name,stored_data.user_email); 
		}
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {  
    }
});