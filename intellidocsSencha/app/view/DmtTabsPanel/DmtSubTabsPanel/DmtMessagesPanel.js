Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtMessagesPanel", {
    extend: 'Ext.dataview.List',
	xtype:'dmtmessageslist',
    config: {
    	
		id:'dmt-messages-list',
		cls:'dmtMessagesList',
		title:'Messages',
		iconCls:'compose',
		store:'DmtMessagesStore',
		emptyText:'<div class="dmtMessagesEmptyText"></div>',
		deferEmptyText:false,
		grouped:false,
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