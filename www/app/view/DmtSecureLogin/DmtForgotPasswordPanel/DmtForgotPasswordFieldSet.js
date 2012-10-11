Ext.define("DMTApp.view.DmtSecureLogin.DmtForgotPasswordPanel.DmtForgotPasswordFieldSet", {
    extend: 'Ext.form.FieldSet',
    xtype:'dmtforgotpasswordfieldset',
	requires:['Ext.Img','Ext.field.Password','Ext.field.Text','Ext.form.FieldSet'],
    config: 
	{
		id:'dmt-forgot-password-fieldset',
		cls:'dmtForgotPasswordFieldset',
		width:200,
		instructions: 'Enter either your username or email id',
		styleHtmlContent:true, 
		items: [
					{
								id:'dmt-forgot-password-box-value-username',
								xtype: 'textfield',
								name : 'dmt_username',
								labelCls:'dmt-forgot-password-box-label',
								placeHolder:'Your Username/Email',
								cls:'dmt-forgot-password-box-value-username'
								
					},
				]
		
	}
});