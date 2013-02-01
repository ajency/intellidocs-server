/*function Downloader() {}

Downloader.prototype.downloadFile = function(fileUrl, params, win, fail) {
	
	//Make params hash optional.
	if (!fail) win = params;
	cordova.exec(win, fail, "Downloader", "downloadFile", [fileUrl, params]);
};


cordova.addConstructor(function() {
	cordova.addPlugin("downloader", new Downloader());
});*/

window.downloadFile = function(fileUrl, params, win, fail){
	cordova.exec(win, fail, "Downloader", "downloadFile", [fileUrl, params]);
};