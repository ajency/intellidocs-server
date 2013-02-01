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