Ext.define("DMTApp.view.DmtSecureLogin.DmtSecureLoginFieldSet", {
    extend: 'Ext.form.FieldSet',
    xtype:'dmtsecureloginfieldset',
	requires:['Ext.Img','Ext.field.Password','Ext.field.Text','Ext.form.FieldSet'],
    config: 
	{
		id:'dmt-secure-login-fieldset',
		cls:'dmt-secure-login-fieldset',
		width:300,
		instructions: 'Please login to access files',
		styleHtmlContent:true, 
		items: [
					{
								id:'dmt-secure-login-box-value-username',
								xtype: 'textfield',
								name : 'dmt_username',
								label: 'Username:',
								labelWidth: 100,
								labelCls:'dmt-secure-login-box-label',
								placeHolder:'Your Username',
								cls:'dmt-secure-login-box-value-username'
								
					},
					{
								id:'dmt-secure-login-box-value-password',
								xtype: 'passwordfield',
								name : 'dmt_password',
								label: 'Password:',
								labelWidth: 100,
								labelCls:'dmt-secure-login-box-label',
								placeHolder:'Your Password',
								cls:'dmt-secure-login-box-value-password'
					}
				]
		
	}
});