/**
 * Constructor

function FileOpenPlugin() {
}
 */
/**
 * Display a new browser with the specified URL.
 * 
 * NOTE: If usePhoneGap is set, only trusted PhoneGap URLs should be loaded,
 *       since any PhoneGap API can be called by the loaded HTML page.
 *
 * @param url           The url to load
 * @param usePhoneGap   Load url in PhoneGap webview [optional] - Default: false
 */
/**FileOpenPlugin.prototype.openFile = function(url) {
	cordova.exec(null, function(){
		alert("Appropriate app not found");		
	}, "FileOpenPlugin", "openFile", [url]);
};


 * Load PdfViewer
 
cordova.addConstructor(function() {
	cordova.addPlugin("FileOpenPlugin", new FileOpenPlugin());
});*/

window.openFile = function(fileUrl, params, win, fail){
	cordova.exec(null, function(){
		alert("Appropriate app not found");		
	}, "FileOpenPlugin", "openFile", [fileUrl]);
};