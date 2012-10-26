Ext.define('DMTApp.controller.DmtLoginFormController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: 
		{
			//Used the action here to prevent conflict on re initialization
            dmtSecureLoginButton:'button[action=dmtSecureLoginFormSubmitButton]',
        },
        control: 
		{
         	dmtSecureLoginButton:
			{
				tap:'dmtSecureLoginButtonTap',
			}
        }
    },
    dmtSecureLoginButtonTap:function()
	{
		//The login functionality goes here
		var secure_login_form = Ext.getCmp('dmt-secure-login-panel');		
		var field_values = secure_login_form.getValues();
		var main_container = Ext.getCmp('dmt-main-container');
		var loginFormModelInstance = Ext.create('DMTApp.model.DmtLoginFormModel',{user_name:field_values.dmt_username,password:field_values.dmt_password});
		 
		main_container.setMasked({xtype: 'loadmask',message: 'Logging In..'});	
	
		var errors = loginFormModelInstance.validate();
		
		if(errors.isValid())
		{
           Ext.Ajax.request({
                            url: global_https + '/wp-content/plugins/aj-file-manager-system/includes/ajax_user_authenticate.php',
                            callbackKey: 'get_user_authenticated',
                            params: field_values,
                            method:'POST',
                            withCredentials: true,
                            useDefaultXhrHeader: false,
                            success: function(result, request)
                            {
                                        global_is_user_logged_in = true;
                                        var result = eval(result.responseText);
										if(result.response == true)
										{
											//Save the logged in information
											this.dmtSecureLoginCookie(request,result);
											
											main_container.unmask();
											
											if(Ext.getCmp('dmt-tabs-panel'))
												Ext.getCmp('dmt-tabs-panel').destroy();
											
											var tabs_panel = Ext.create('DMTApp.view.DmtTabsPanel');
											main_container.setActiveItem(tabs_panel);
											
										}
										else
										{
											main_container.unmask();
											Ext.Msg.alert('Oops..','The user name and/or password provided is incorrect', Ext.emptyFn);
											secure_login_form.reset();
										}
									},
									failure: function()
									{
										main_container.unmask();
										Ext.Msg.alert('Oops..','The request did not go through', Ext.emptyFn);
									},
									scope :this,
								});
		}
		else
		{
			main_container.unmask();
			Ext.Msg.alert('Oops..','Please provide a user name and password', Ext.emptyFn);
			secure_login_form.reset();
		}
	},
	//Function to Save the logged in information
	dmtSecureLoginCookie:function(request,result)
	{
			//Get the user name from the request
			var dmt_username = request.params.dmt_username;
			var login_info_store = Ext.getStore('DmtLocalStorageCookie');
			login_info_store.load();
			
			var index = login_info_store.find('key','dmtScLgInfo');
			
			if(index == -1)
			{
				//setup localstorage with valuesttg
				var record = Ext.create('DMTApp.model.DmtLocalStorageCookieModel', {key: 'dmtScLgInfo',value: 'loggedInSuccessfully',user_name:dmt_username,user_email:result.email});
				record.save();					
			}
			else
			{
				//Get the old value and set new value
				var record = login_info_store.getAt(index);
				record.set('value','loggedInSuccessfully');
				record.set('user_name',dmt_username);
				record.set('user_email',result.email);
				record.save();
			}
	}

});