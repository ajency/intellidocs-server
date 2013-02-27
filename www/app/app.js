Ext.application({
    models: ["ChangePasswordFormModel", "DmtForgotPasswordModel", "DmtNotificationsModel", "DmtLocalStorageCookieModel", "DmtLoginFormModel", "DmtFolderStructureModel","DmtMessagesModel"],
                
    stores:['DmtFolderStructureStore','DmtLocalStorageCookie','DmtNotificationsStore','DmtMessagesStore'],
	
    controllers: ["DmtForgotPasswordController", "DmtNotificationsDetailsPanelRefreshButtonControlller", "DmtNotificationsTabClickController", "DmtNotificationButtonController", "DmtNestedListSortController", "DmtSettingsController", "DmtMainViewPortController", "DmtLoginFormController", "DmtNestedListController", "DmtFileDetailsController", "DmtFolderStructureController", "DmtTabsPanelController","DmtMessagesListController"],

    name: 'DMTApp',

    requires: [
        'Ext.MessageBox','Ext.direct.PollingProvider','Ext.direct.*','Ext.field.Hidden','Ext.data.JsonP','Ext.field.Toggle','Ext.DateExtras'
    ],

    views: [
				'Main',
				'DmtSecureLogin',
				'DmtTabsPanel',
				'DmtSecureLogin.DmtSecureLoginFieldSet',
				'DmtSecureLogin.DmtForgotPasswordPanel',
				'DmtSecureLogin.DmtForgotPasswordPanel.DmtForgotPasswordFieldSet',
				'DmtTabsPanel.DmtSubTabsPanel',
				'DmtTabsPanel.DmtDetailsPanel',
				'DmtTabsPanel.DmtDetailsPanel.DmtChangePasswordPanel',
				'DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure',
				'DmtTabsPanel.DmtSubTabsPanel.DmtSettings',
				'DmtTabsPanel.DmtSubTabsPanel.DmtNotificationsPanel',
				'DmtTabsPanel.DmtDetailsPanel.DmtNotificationsDetailPanel',
				'DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList',
				'DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList.DmtNestedListSortPanel',
                'DmtTabsPanel.DmtSubTabsPanel.DmtMessagesPanel'
			],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function(){
        this.launched = true;
        this.mainlaunch();
    },
    mainlaunch: function() {
                
        if(!device || !this.launched)
        {
            return;
        }
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
		Ext.Viewport.add(Ext.create('DMTApp.view.Main'));
    
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
