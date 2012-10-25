Ext.define('DMTApp.model.DmtFolderStructureModel', {
           extend: 'Ext.data.Model',
           
           config: {
           
           fields: [
                    {name: 'items', type: 'auto'},
                    {name:'f_name', type:'string'},
                    {name:'f_type', type:'string'},
                    {name:'f_ext', type:'auto'},
                    {name:'f_attachment', type:'auto'},
                    {name:'f_modified', type:'string'},
                    {name:'f_id', type:'int'},
                    {name:'f_folder', type:'auto'},
                    {name:'f_description', type:'auto'},
                    {name:'f_solicitor', type:'auto'},
                    {name:'f_item_id', type:'int'},
                    {name:'f_file_count',type :'int'},
                    {name:'fld_item_id',type: 'auto'},
                    {name:'f_sub_fld_count',type: 'int'},
                    {name:'f_folders',type:'auto'}
                    ],
           
           }
});