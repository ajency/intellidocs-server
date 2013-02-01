Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtNotificationsPanel", {
    extend: 'Ext.dataview.List',
	xtype:'dmtnotificationslist',
    config: {
		emptyText:'<div class="dmtNotificationsEmptyText"></div>',
		deferEmptyText:false,
		grouped:true,
		store:'DmtNotificationsStore',
		id:'dmt-notifications-list',
		cls:'dmtNotificationsList',
		title:'History',
		iconCls:'time',
		itemTpl: '<span class="dmtNotificationMessage">{notify_message}</span><div class="dmtNotificationMessageMeta"><span class="dmtNotificationMessageMetaFolder">{folder}</span></div>',
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