package com.plugins;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.cordova.*;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.webkit.CookieManager;
import android.os.Environment;

 

public class Downloader extends CordovaPlugin {

	private String fileName;
	private String dirName;
	private int progress;
	private int fileSize;
	private CallbackContext callbackId;
	
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackId) throws JSONException {
		
		if (action.equals("downloadFile"))
		{
			try 
			{
				String fileUrl = args.getString(0);
				JSONObject params = args.getJSONObject(1);

				String fileName = params.has("fileName") ? 
						params.getString("fileName"):
							fileUrl.substring(fileUrl.lastIndexOf("/")+1);

						String dirName = params.has("dirName") ?
								params.getString("dirName"):
									Environment.getExternalStorageDirectory().getPath() + "/DMTApp";

								Boolean overwrite = params.has("overwrite") ? params.getBoolean("overwrite") : false;

								this.downloadUrl(fileUrl, dirName, fileName, overwrite, callbackId);
								
							return true;	

			} catch (JSONException e) {
				callbackId.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION, e.getMessage()));

			} catch (InterruptedException e) {
				callbackId.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, e.getMessage()));
			}
		}
		else
		{
			callbackId.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
		}
		return true;
	}
	
	private void downloadUrl(String fileUrl, String dirName, String fileName, Boolean overwrite, CallbackContext callbackId) throws InterruptedException, JSONException {
		
		try {
			
			Log.d("PhoneGapLog", "Downloading "+fileUrl + " into " + dirName + "/" + fileName);
			
			File dir = new File(dirName);
			if (!dir.exists()) {
				Log.d("PhoneGapLog", "directory " + dirName + " created");
				dir.mkdirs();
			}

			File file = new File(dirName, fileName);

			if (!overwrite && file.exists()) {
				Log.d("DownloaderPlugin", "File already exist");
				
				JSONObject obj = new JSONObject();
				obj.put("status", 1);
				obj.put("total", 0);
				obj.put("file", fileName);
				obj.put("dir", dirName);
				obj.put("progress", 100);
				
				PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
	            callbackId.sendPluginResult(pluginResult);
			}

			URL url = new URL(fileUrl);
			HttpURLConnection ucon = (HttpURLConnection) url.openConnection();
			System.setProperty("http.keepAlive", "false");

			// Set cookies in requests
		    CookieManager cookieManager = CookieManager.getInstance();
		    String cookie = cookieManager.getCookie(ucon.getURL().toString());
		    if (cookie != null) {
		    	ucon.setRequestProperty("Cookie", cookie);
		    }
			ucon.setRequestMethod("POST");
			ucon.setConnectTimeout(120*100);

			ucon.connect();

			Log.d("PhoneGapLog", "Download start");

			InputStream is = ucon.getInputStream();
			byte[] buffer = new byte[1024 * 200];
			int readed = 0, 
			    progress = 0,
			    totalReaded = 0,
			    fileSize = ucon.getContentLength();
			
			FileOutputStream fos = new FileOutputStream(file);

			while ((readed = is.read(buffer)) > 0) {
				
				fos.write(buffer, 0, readed);
				totalReaded += readed;
				
				int newProgress = (int) (totalReaded*100/fileSize);				
				if (newProgress != progress)
				{
					this.fileName = fileName;
					this.fileSize = fileSize;
					this.progress = newProgress;
					this.dirName = dirName;
					this.callbackId = callbackId;

				  progress = this.informProgress(fileSize, newProgress, dirName, fileName, callbackId);
				}

			}

			fos.close();
			ucon.disconnect();

			Log.d("PhoneGapLog", "Download finished");

			JSONObject obj = new JSONObject();
			obj.put("status", 1);
			obj.put("total", fileSize);
			obj.put("file", fileName);
			obj.put("dir", dirName);
			obj.put("progress", progress);
			
			//PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,obj);
            //pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(new PluginResult(PluginResult.Status.OK,obj));
			
		}
		catch (FileNotFoundException e) {
			Log.d("PhoneGapLog", "File Not Found : " + e);
			callbackId.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, 404));
		}
		catch (IOException e) {
			Log.d("PhoneGapLog", "FIle download error : " + e);
			callbackId.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, e.getMessage()));
		}

	}
	
	private int informProgress(int fileSize, int progress, String dirName, String fileName, CallbackContext callbackId) throws InterruptedException, JSONException {
				
		JSONObject obj = new JSONObject();
		obj.put("status", 0);
		obj.put("total", fileSize);
		obj.put("file", fileName);
		obj.put("dir", dirName);
		obj.put("progress", progress);
		
	
			Log.d("PhoneGapLog", "Progress Is : " + progress);
			PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
            
		//Give a chance for the progress to be sent to javascript
        Thread.sleep(100);
		
		return progress; 
	}

}
