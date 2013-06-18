Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList", {
    extend: 'Ext.dataview.List',
	xtype:'dmtnestedfolderlist',
    config: {
    	title:'Files',
		id:'dmt-nested-list',
		ui : 'dark',
		cls:'dmtNestedList',
		masked: 
		{
    			xtype: 'loadmask',
    			message: 'Loading Files...',
		},
		showAnimation : 'slideIn',
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
		itemTpl: '<table class="dmtNestedListItem {f_open}">' + 
	           '<tbody>'+
	           '<tr>'+
	           '<td style="width:17%" align="center">{[values.fld_item_id != 0 ? values.fld_item_id : \'\']} </td>'+
	           '<td style="width:70%">'+
	           '<div class="dmt-file-icon-small dmt-file-{[values.f_ext.replace(\'.\',\'\')]}"></div>'+
	           '<span class="dmt-list-item-fname">{f_name}</span>'+
	           '<div class="dmtMessagesDate">'+
	           '{[values.f_description.length > 130 ? values.f_description.substring(0,127)+\'.....\' : values.f_description]}'+  
	           '</div>'+
	           '</td>'+
	           '<td class="dmtNestedListItemType">'+
	           '<span class="dmtMetaData">{f_ext}</span>'+
	           '</td></tr></tbody></table>',
		layout: {
					animation: {
						type: 'fade',
						duration: 100
					},
					type : 'fit'
				},
    }
});