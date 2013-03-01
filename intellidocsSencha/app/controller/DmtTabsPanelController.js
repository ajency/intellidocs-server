Ext.define('DMTApp.controller.DmtTabsPanelController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
        	dmtTabsPanel: '[id=dmt-tabs-panel]', 
        },
        control: {
        	dmtTabsPanel:{
        		painted:'dmtTabsPanelViewportUnmask'
        	}
        }
    },
    dmtTabsPanelViewportUnmask:function(){
    
    },
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});