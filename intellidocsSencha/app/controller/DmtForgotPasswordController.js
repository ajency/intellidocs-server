Ext.define('DMTApp.controller.DmtForgotPasswordController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            dmtForgotPasswordFormOpenButton:'button[action=dmtForgotPasswordFormOpenButton]',
			dmtForgotPasswordFormSubmitButton:'button[action=dmtForgotPasswordFormSubmitButton]',
        },
        control: {
            dmtForgotPasswordFormOpenButton:
			{
				tap:'dmtForgotPasswordFormOpenButtonTap'
			},
			dmtForgotPasswordFormSubmitButton:
			{
				tap:'dmtForgotPasswordFormSubmitButtonTap'
			},			
        }
    },
    dmtForgotPasswordFormOpenButtonTap:function()
	{
		if(Ext.getCmp('dmt-forgot-password-panel'))
			Ext.getCmp('dmt-forgot-password-panel').destroy();
			
		Ext.Viewport.add(Ext.create('DMTApp.view.DmtSecureLogin.DmtForgotPasswordPanel')).show()
	},
	dmtForgotPasswordFormSubmitButtonTap:function()
	{
		var forgot_password_form = Ext.getCmp('dmt-forgot-password-panel');		
		var field_values = forgot_password_form.getValues();
		var passwordFormModelInstance = Ext.create('DMTApp.model.DmtForgotPasswordModel',{user_name:field_values.dmt_username});
		var errors = passwordFormModelInstance.validate();
		if(errors.isValid())
		{
			Ext.Viewport.mask({xtype:'loadmask',message:'Resetting password...'});
			Ext.data.JsonP.request({
			url: global_https+'/wp-content/plugins/aj-file-manager-system/includes/ajax_user_retrieve_password.php',
			callbackKey:'dmt_reset_password',
			params:
			{
				user_login:field_values.dmt_username,
				password_action_type:'retrieve_password'
			},
			success: function(response, opts) {
				Ext.Viewport.unmask();
					if(response.response == false)
					{
						switch(response.error_code)
						{
							case 0: //No user name present
								Ext.Msg.alert('Oops...','You must provide a valid username or email id');
							break;
							case 1: //Email invalid
								Ext.Msg.alert('Oops...','The email id provided is invalid');
							break;
							case 2: //User name or email error
								Ext.Msg.alert('Oops...','You must provide a valid username or email id');
							break;
							case 3: //The email did not go through
								Ext.Msg.alert('Oops...','The email containg your new password did not go through!. Please try again.');
							break;
							case 4: //No user name present
								Ext.Msg.alert('Oops...','Someting seems to have gone wrong. Try  again later');
							break;
						}
					}
					else if( response.response == true)
					{
						Ext.Msg.alert('Password Reset','Your password has been reset, The new password has been sent to your registered email account');
						forgot_password_form.destroy();
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
			Ext.Msg.alert('Oops..','You must provide a username or an email id');
		}
		 
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});