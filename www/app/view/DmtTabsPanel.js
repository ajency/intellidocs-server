Ext.define("DMTApp.view.DmtTabsPanel", {
    extend: 'Ext.Container',
    xtype:'dmttabspanelmain',
    config: {
		autoDestroy:true,
		id:'dmt-tabs-panel',
		cls:'dmtTabsPanel',
		fullscreen:true,
		layout:
		{
			type:'hbox',
		},
        items: [
		{
				xtype:'dmtsubtabspanel',
		},
		{	
				xtype:'dmtdetailspanel',
		}
		]
    }
});
