Ext.define('DMTApp.controller.DmtMessagesListController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            dmtMessagesList			  			:'.dmtmessageslist',
			dmtMessageDetailsPanelCloseButton	:'button[action=dmtMessagesDetailPanelClose]'
        },
        control: {
            dmtMessagesList:
			{
				itemtap		:'dmtMessagesListItemTap'
			},
			dmtMessageDetailsPanelCloseButton:
			{
				tap			:'dmtMessageDetailsPanelClose'
			}
        }
    },
	dmtMessageDetailsPanelClose:function(button)
	{
		if(Ext.getCmp('dmt-messages-details-panel'))
				Ext.getCmp('dmt-messages-details-panel').destroy();
	},
    dmtMessagesListItemTap:function(currentView,currentIndex,target,record)
	{
		title 	= record.getData().message_title;
		message = record.getData().message_content;
		message.replace('\r\n\r\n','</p><p>');
		
		var details_container = Ext.getCmp('dmt-details-container');
		var details_container_titlebar = Ext.getCmp('dmt-details-container-titlebar');		
		
		message_details_panel = {
					
		id:'dmt-messages-details-panel',
		cls:'dmtMessagesDetailPanel',
		width:"46%",
		height:600,
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
                    springTension: 0.9999                    
                },
                minVelocity: 5
            },
            outOfBoundRestrictFactor: 0
        },
		layout:
		{
			type:'vbox'
		},
        items: [
			
			{
				xtype:'panel',
				html:'<div class="dmtMessagesDetailPanelWrapper"><h2 class="dmtMessagesDetailPanelTitle">'+title+'</h2><div class="dmtMessagesDetailPanelMsg">'+ message +'</div></div>',
				items:[
				
				]
			},
			{
						xtype:'titlebar',
						docked:'top',
						title:'Message Details',
						items:[
									{	
										xtype:'button',
										action:'dmtMessagesDetailPanelClose',
										iconCls:'delete',
										iconMask:true,
										ui:'plain',
										align:'right'
									}
								]
			}
			]
		};
		
		if(Ext.getCmp('dmt-messages-details-panel'))
				Ext.getCmp('dmt-messages-details-panel').destroy();
		
		var new_details_panel = Ext.create('Ext.Panel',message_details_panel);
		
		new_details_panel.showBy(currentView);
		//details_container.add([new_details_panel]).show({type:'pop',duration:500,easing:'ease-out'});
		
	},
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    }
});