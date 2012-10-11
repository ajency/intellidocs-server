Ext.define("DMTApp.view.DmtTabsPanel.DmtDetailsPanel.DmtNotificationsDetailPanel", {
    extend: 'Ext.Container',
	xtype:'dmtnotificationsdetailspanel',
    config: {
		id:'dmt-notifications-details-panel',
		cls:'dmtNotificationsDetailsPanel',
		layout:
		{
			type:'vbox',
			pack:'center',
			align:'center',
		},
		styleHtmlContent:true,
        items: [
		{html:'<div class="dmtNotificationDetailsPanelInfo"><span>Please click the refresh button to update files list</span></div>'},
		{
			xtype:'button',
			cls:'dmtNotificationsDetailsPanelRefreshButton',
			ui:'round',
			height:40,
			iconCls:'refresh',
			iconMask:true,
			iconAlign:'right',
			text:'Refresh Files List',
			action:'dmtNotificationsDetailsPanelRefresh'
		}
		],
		
    }
});