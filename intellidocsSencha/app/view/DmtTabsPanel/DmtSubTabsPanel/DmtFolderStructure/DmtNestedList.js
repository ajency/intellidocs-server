Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList", {
    extend: 'Ext.dataview.NestedList',
	xtype:'dmtnestedfolderlist',
    config: {
		title:'Files',
		id:'dmt-nested-list',
		cls:'dmtNestedList',
		displayField:'f_name',
		toolbar:
		{
			ui:'dark',
			cls:'dmtNestedListToolBar',
			id:'dmt-nested-list-toolbar',
			items:[
					{
						xtype:'button',
						align:'right',
						iconCls:'refresh',
						iconMask:true,
						id:'dmt-nested-list-refresh-button',
						ui:'plain',
						action:'dmtNestedListRefreshButton'
					}
			]
		},
		masked: 
		{
    			xtype: 'loadmask',
    			message: 'Loading Files...',
		},
		listConfig:
		{
			pressedDelay:1,
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
			variableHeights:true,
		},
		layout: {
					animation: {
						type: 'fade',
						duration: 100
					},
					type: 'card'
				},
    },
    getItemTextTpl: function(node){
        var tplConstructor = '<table class="dmtNestedListItem">' + 
           '<tbody>'+
           '<tr>'+
           '<td style="width:17%" align="center">{[values.fld_item_id != null ? values.fld_item_id : values.f_item_id != null ? values.f_item_id : \'\']} </td>'+
           '<td style="width:70%">'+
           '<div class="dmt-file-icon-small dmt-file-{[values.f_ext.replace(\'.\',\'\')]}"></div>'+
           '<span class="dmt-list-item-fname">{f_name}</span>'+
           '<div class="dmtMessagesDate">'+
           '{[values.f_description.length > 130 ? values.f_description.substring(0,127)+\'.....\' : values.f_description]}'+  
           '</div>'+
           '</td>'+
           '<td class="dmtNestedListItemType">'+
           '<span class="dmtMetaData">{f_ext}</span>'+
           '</td></tr></tbody></table>';
           return tplConstructor;
    },
});