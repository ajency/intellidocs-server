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
		}
    },
    getItemTextTpl: function(node){
        var tplConstructor = '<table class="dmtNestedListItem">' + 
           '<tbody>'+
           '<tr>'+
           '<td style="width:12%">{[values.f_item_id != null ? values.f_item_id : \'\']} </td>'+
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