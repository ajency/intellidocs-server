Ext.define("DMTApp.view.DmtSecureLogin.DmtForgotPasswordPanel", {
    extend: 'Ext.form.Panel',
    xtype:'dmtforgotpasswordpanel',
    config: {
		id:'dmt-forgot-password-panel',
		modal:true,
		hideOnMaskTap:true,
		width:300,
		height:400,
		centered:true,
		layout:
		{
			type:'vbox',
			align:'center',
			pack:'center',
		},
        items: [
		{
			xtype:'titlebar',
			title:'Forgot Password',
			docked:'top'
		},
		{	
			xtype:'panel',
			width:200,//Exact width of the logo
			height:71,//Exact height of the logo
			cls:'dmt-secure-login-panel-logo',
		},
		{
			xtype:'dmtforgotpasswordfieldset',
		},
		{
			xtype:'button',
			id:'dmt-forgot-password-form-submit-button',
			text:'Reset Password',
			ui:'confirm round',	
			action:'dmtForgotPasswordFormSubmitButton'			
		}
		]
    }
});
