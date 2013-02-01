Ext.define("DMTApp.view.DmtTabsPanel.DmtDetailsPanel", {
    extend: 'Ext.Container',
	xtype:'dmtdetailspanel',
	
    requires: [],
    config: {
		id:'dmt-details-container',
		cls:'dmtDetailsContainer',
		flex:1,
		layout:
		{
			type:'card',
		},
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
		styleHtmlContent:false,
        items: [
		{
			id:'dmt-details-container-titlebar',
			xtype:'titlebar',
			title:'Details Panel',
			docked:'top',	
			cls:'dmtDetailsContainerTitleBar'		
		},
		{
			xtype:'panel',
			cls:'dmtDetailsViewPanelMain',
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
			styleHtmlContent:false,
		}
		],
		
    }
});