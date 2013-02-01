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
		scrollable:{
            direction: 'vertical',
            directionLock: true,
            momentumEasing: {
                momentum: {
                    acceleration: 30,
                    friction: 0.5
                },
                bounce: {
                    acceleration: 0.0001,
                    springTension: 0.9999,
                    
                },
                minVelocity: 5
            },
            outOfBoundRestrictFactor: 0
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