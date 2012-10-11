Ext.define("DMTApp.view.DmtTabsPanel.DmtDetailsPanel.DmtChangePasswordPanel", {
    extend: 'Ext.form.Panel',
	xtype:'dmtchangepasswordpanel',
    config: {
		id:'dmt-change-password-panel',
		cls:'dmtChangePasswordPanel',
		layout:
		{
			type:'vbox',
			pack:'center',
			align:'center',
		},
		styleHtmlContent:true,
        items: [
			
				{	
					xtype:'fieldset',
					width:'50%',
					defaults:
					{
						labelWidth:'35%',
						required:true,
					},
					items:
					[
						{
							xtype:'passwordfield',
							label:'Old Password:',
							name:'dmt_old_password',
							labelCls:'dmtChangePwUserPwLabel'
						},
						{
							xtype:'passwordfield',
							label:'New Password:',
							name:'dmt_new_password',
							labelCls:'dmtChangePwUserNewPwLabel'
						},
						{
							xtype:'passwordfield',
							label:'Confirm Password:',
							name:'dmt_new_re_password',
							labelCls:'dmtChangePwUserNewPwLabel'
						}
					]
				},//End of field set
				{
					xtype:'button',
					text:'Change Password',
					action:'dmtChangePasswordPanelButton',
					ui:'confirm round',
				}
				
		],
		
    }
});