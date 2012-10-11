Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtNotificationsPanel", {
    extend: 'Ext.dataview.List',
	xtype:'dmtnotificationslist',

    config: {
		emptyText:'<div class="dmtNotificationsEmptyText" style="text-align:center"><span>No new notifications</span></div>',
		deferEmptyText:false,
		grouped:true,
		store:'DmtNotificationsStore',
		id:'dmt-notifications-list',
		cls:'dmtNotificationsList',
		title:'History',
		iconCls:'time',
		itemTpl: '<span class="dmtNotificationMessage">{notify_message}</span><div class="dmtNotificationMessageMeta"><span class="dmtNotificationMessageMetaFolder">{folder}</span></div>',
		items:
		[
			{
				xtype:'titlebar',
				title:'History',
				docked:'top',
			}
		]		
    }	
})