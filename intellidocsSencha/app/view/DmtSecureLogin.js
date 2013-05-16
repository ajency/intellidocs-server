Ext.define("DMTApp.view.DmtSecureLogin", {
    extend: 'Ext.form.Panel',
    xtype:'dmtsecureloginpanel',
    config: {
		id:'dmt-secure-login-panel',
		fullscreen:true,
		layout:
		{
			type:'vbox',
			pack:'center',
			align:'center'
			
		},
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
        items: [
		{	
			xtype:'panel',
			width:200,//Exact width of the logo
			height:71,//Exact height of the logo
			cls:'dmt-secure-login-panel-logo',
		},
		{
			xtype:'dmtsecureloginfieldset',
		},
		{
			xtype:'panel',
			layout:
			{
				type:'vbox',
				pack:'center',
			},
			items:[
					{
						xtype:'button',
						id:'dmt-secure-login-form-submit-button',
						text:'Login',
						ui:'confirm round',	
						action:'dmtSecureLoginFormSubmitButton'
					},
					{
						xtype:'spacer'
					},
					{
						xtype:'button',
						id:'dmt-forgot-password-form-open-button',
						text:'Forgot Password',
						ui:'normal round',	
						action:'dmtForgotPasswordFormOpenButton',
						style:'margin-top:20px'
					}
				 ]
		}
		]
    }
});