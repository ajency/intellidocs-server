Ext.define("DMTApp.view.Main", {
    extend: 'Ext.Container',
    requires: ['DMTApp.view.DmtTabsPanel','DMTApp.view.DmtSecureLogin'],
    config: {

		id:'dmt-main-container',
		autoDestroy:true,
		layout:
		{
			type:'card',
			animation:false
		},
        items: []
    }
});
