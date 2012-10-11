
// (c) 2012 Suraj Air


/*global Cordova */

function OpenFile() {
}


/* The interface that you will use to access functionality */

// view a file using native app
OpenFile.prototype.viewFile = function(loc)
{
    cordova.exec("OpenFilePlugin.viewFile", loc);
  
};


cordova.addConstructor(function()
{
  if(!window.plugins) { window.plugins = {};}

  window.plugins.openfile = new OpenFile();
});

