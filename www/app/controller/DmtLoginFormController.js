Ext.define('DMTApp.controller.DmtLoginFormController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: 
		{
			//Used the action here to prevent conflict on re initialization
            dmtSecureLoginButton:'button[action=dmtSecureLoginFormSubmitButton]',
           dmtSecureLoginPanel:'[id=dmt-secure-login-panel]',
           dmtTabsPanel:'[id=dmt-tabs-panel]',
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
		 
		var errors = loginFormModelInstance.validate();
		
		if(errors.isValid())
		{
           
           if(!navigator.onLine)
           {
	           //offline login.
	           Ext.Viewport.setMasked({xtype: 'loadmask',message: 'Logging In..'});
	           
	           var login_info_store = Ext.getStore('DmtLocalStorageCookie');
	           login_info_store.load();
	           var index = login_info_store.find('key','dmtScLgInfo');
           
	           if(index != -1)
	           {
		           //some record exists.
		           var record       = login_info_store.getAt(index);
		           var stored_data  = record.getData();
		           var stored_uname = stored_data.user_name;
		           var stored_pass  = stored_data.user_pass;
		           var input_uname	= field_values.dmt_username;
		           var input_pass   = MD5(field_values.dmt_password);
		           var _currentScope = this;
		           
		           if((stored_uname == input_uname) && (stored_pass == input_pass))
		           {
		               
		                var createDelay = Ext.create('Ext.util.DelayedTask', function() {
		                                        
		                                        
		                                        if(Ext.getCmp('dmt-tabs-panel'))
		                                        Ext.getCmp('dmt-tabs-panel').destroy();
		                                        
		                                        _currentScope.getDmtSecureLoginPanel().destroy();
		                                        
		                                        var tabs_panel = Ext.create('DMTApp.view.DmtTabsPanel');
		                                        main_container.add(tabs_panel).show();
		                                        
		                                   });
           
		                createDelay.delay(1000);
		           }
		           else
		           {
		                Ext.Viewport.unmask();
		                Ext.Msg.alert('Oops..','The user name and/or password provided is incorrect', Ext.emptyFn);
		                secure_login_form.reset();
		           }
		        }
		        else
		        {
		           Ext.Viewport.unmask();
		           Ext.Msg.alert('Oops..','Unable to provide offline login', Ext.emptyFn);
		        }
	    	}
	   		else
	    	{
	    		Ext.Viewport.setMasked({xtype: 'loadmask',message: 'Logging In..'});
	           
	            Ext.Ajax.request({
	                            url: global_https + '/wp-content/plugins/aj-file-manager-system/includes/ajax_user_authenticate.php',
	                            callbackKey: 'get_user_authenticated',
	                            params: field_values,
	                            disableCaching : true,
	                            method:'GET',
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
												Ext.Viewport.unmask();
												Ext.Msg.alert('Oops..','The user name and/or password provided is incorrect', Ext.emptyFn);
												secure_login_form.reset();
											}
										},
										failure: function()
										{
											Ext.Viewport.unmask();
											Ext.Msg.alert('Oops..','The request did not go through', Ext.emptyFn);
										},
										scope :this,
									});
           	}
		}
		else
		{
			Ext.Viewport.unmask();
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
           var record = Ext.create('DMTApp.model.DmtLocalStorageCookieModel', {key: 'dmtScLgInfo',value: 'loggedInSuccessfully',user_name:dmt_username,user_email:result.email,user_pass : result.key});
				record.save();					
			}
			else
			{
				//Get the old value and set new value
				var record = login_info_store.getAt(index);
				record.set('value','loggedInSuccessfully');
				record.set('user_name',dmt_username);
				record.set('user_email',result.email);
                record.set('user_pass',result.key);
				record.save();
			}
	}

});