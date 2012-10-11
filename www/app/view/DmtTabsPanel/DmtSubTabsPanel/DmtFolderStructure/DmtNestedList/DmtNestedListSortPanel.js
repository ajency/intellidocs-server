Ext.define("DMTApp.view.DmtTabsPanel.DmtSubTabsPanel.DmtFolderStructure.DmtNestedList.DmtNestedListSortPanel", {
    extend: 'Ext.Panel',
	xtype:'dmtnestedlistsortpanel',
    config: {
		id:'dmt-nested-list-sort-panel',
		height:30,
		docked:'top',
		cls:'dmtNestedListSortPanel',
		layout:
				{
					type:'hbox',
					pack:'middle',
				},
				defaults:
				{
							xtype:'button',
							
							iconCls:'arrow_down',
							iconMask:true,
							iconAlign:'right',
							ui:'plain',
							height:30,
							cls:'dmtNestedListSortButtons'
				},
				items:[
                       {
                            iconMask:false,
                            text:'Item ID',
                            width:'18%',
                            id:'dmt-nested-list-sort-by-item-id',
                            action:'dmtNestedListSortByItemId'
                       },
                       {
							text:'Name',
                            flex:2,
							id:'dmt-nested-list-sort-by-name',
							action:'dmtNestedListSortByName'
						},
						{
							text:'Type',
                            flex:1,
							id:'dmt-nested-list-sort-by-type',
							action:'dmtNestedListSortByType'
						}
					  ]
	}
})