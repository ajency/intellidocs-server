Ext.define("DMTApp.store.DmtMessagesStore", {
	extend: "Ext.data.Store",
	requires:['Ext.data.proxy.JsonP'],
    config: {
		
        model: 'DMTApp.model.DmtMessagesModel',
	}

});