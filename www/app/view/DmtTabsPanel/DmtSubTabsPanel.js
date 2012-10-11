Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel", {
    extend: 'Ext.TabPanel',
	xtype:'dmtsubtabspanel',
    config: {
		id:'dmt-sub-tabs-panel',	
		cls:'dmtSubTabsPanel',
		layout:
		{
			animation:{type:'flip',duration:500},
		},
		flex:1,
		tabBar:
		{
			docked:'bottom',
			cls:'dmtSubTabsPanelTitleBar',
		},
        items:
        [
        {
            xtype:'dmtfolderstucture',
        },
        {
            xtype:'dmtnotificationslist',
        },
        {
            xtype:'dmtmessageslist',
        },
        {
            xtype:'dmtsettings',
        },
            
        ],
		
    }
});