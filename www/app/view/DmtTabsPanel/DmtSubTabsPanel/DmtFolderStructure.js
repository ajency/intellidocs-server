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
		iconCls:'organize',	
        items:
		 [
			{
				xtype:'dmtnestedfolderlist',
			}
		
		],
		
    }
});