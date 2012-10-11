Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtSettings", {
    extend: 'Ext.form.Panel',
	xtype:'dmtsettings',
	id:'dmt-settings-panel',
    requires: ['Ext.TitleBar'],
    config: {	
		title:'Settings',
		iconCls:'settings',
		cls:'dmtSettings',
		styleHtmlContent:true,
		layout:
		{
			type:'vbox',
			pack:'center',
			align:'center',
		},
        items:[
				{
					xtype:'titlebar',
					docked:'top',
					title:'Settings',
					cls:'dmtSettingsTitleBar'
				},
				
				{
					
					xtype:'fieldset',
					title:'User Details',
					width:'80%',
					defaults:
					{
						labelWidth:'35%',
						xtype:'textfield',
					},
					items:
					[
						{
							id:'dmt-settings-panel-user-name',
							label:'Username:',
							disabled:true,
						},
						{
							id:'dmt-settings-panel-user-email',
							label:'Email:',
							disabled:true,
						}
					]
				},
				{
					
					xtype:'fieldset',
					title:'User Options',
					width:'80%',
					defaults:
					{
						labelWidth:'65%',
						xtype:'togglefield',
					},
					items:
					[
						{
							label:'Change Password:',
							id:'dmt-settings-panel-change-password'
						},
						{
							label:'Logout:',
							id:'dmt-settings-panel-logout'
						}
					]
               },
               {
                    xtype:'fieldset',
                    title:'Files & Folder Option',
                    width:'80%',
                    defaults:
                    {
                        labelWidth:'65%',
                        xtype:'button',
                    },
                    items:
                    [
                    {
                        style:'margin:10px;',
                        xtype:'button',
                        text:"Delete All File & folder from device",
                        cls:'dmt-details-panel-download-button',
                        ui:'normal',
                        iconCls:'delete',
                        iconMask:true,
                        iconAlign:'right',
                        height:32,
                        action:"dmtSettingsDeleteAllButton",
                     }
                     ]
               }
		
		],
		
    }
});