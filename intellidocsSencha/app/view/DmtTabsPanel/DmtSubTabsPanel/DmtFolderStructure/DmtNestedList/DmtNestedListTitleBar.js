Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList.DmtNestedListTitleBar", {
    extend: 'Ext.TitleBar',
	xtype:'dmtnestedlisttitlebar',
    config: {
		id:'dmt-nested-list-title-bar',
		docked:'top',
		title: 'Files',
		cls:'dmtNestedListTitleBar',
		layout: {
			type:'hbox',
		},
		items:[{
			xtype: 'button',
            ui: 'back',
            width : '70px',
            align:'left',
            text : 'Back',
			id:'dmt-nested-list-back-button',
			action:'dmtNestedListBackButton'
		},
		{
			xtype:'button',
			align:'right',
			iconCls:'refresh',
			iconMask:true,
			id:'dmt-nested-list-refresh-button',
			ui:'plain',
			action:'dmtNestedListRefreshButton'
		}]
	}
})