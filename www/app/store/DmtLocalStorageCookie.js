Ext.define("DMTApp.store.DmtLocalStorageCookie", {
	extend: "Ext.data.Store",
	requires:['Ext.data.proxy.LocalStorage'],
    config: {
        model: "DMTApp.model.DmtLocalStorageCookieModel",

	}
});