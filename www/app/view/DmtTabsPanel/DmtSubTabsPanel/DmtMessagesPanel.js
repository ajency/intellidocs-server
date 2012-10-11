Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtMessagesPanel", {
    extend: 'Ext.dataview.List',
	xtype:'dmtmessageslist',

    config: {
		emptyText:'<div class="dmtNotificationsEmptyText"><span>No messages found</span></div>',
		deferEmptyText:false,
		grouped:false,
		store:'DmtMessagesStore',
		id:'dmt-messages-list',
		cls:'dmtMessagesList',
		title:'Messages',
		iconCls:'compose',
		itemTpl: '<div class="dmtMessagesTitle"><div class="dmtMessagesIcon"></div>{message_excerpt}<div class="dmtMessagesDate">{message_date}</div></div>',
		items:
		[
			{
				xtype:'titlebar',
				title:'Messages',
				docked:'top',
			}
		]		
    }	
})