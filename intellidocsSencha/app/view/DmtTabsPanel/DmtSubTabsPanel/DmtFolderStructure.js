Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure", {
    extend: 'Ext.Container',
	xtype:'dmtfolderstucture',
    config: {
		layout:
		{
			type:'fit'
		},
		cls:'dmtFolderStructure',
		title:'Files',
		id:'dmt-main-tab',
		iconCls:'organize',	
        items:
		 [
			{
				xtype:'dmtnestedfolderlist',
			}
		
		],
		
    }
});