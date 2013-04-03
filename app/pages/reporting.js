define(['app','pages/basepage'],function  (app, BasePage) {
	
    var View = BasePage.View.extend({
        pageName:'Reporting Page'
    });

    var Model = BasePage.Model.extend({

    })
    
    return {
        View:View,
        Model:Model
    };

});