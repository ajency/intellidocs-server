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
		styleHtmlContent:true,
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
			scrollable:true,
			styleHtmlContent:true,
		}
		],
		
    }
});