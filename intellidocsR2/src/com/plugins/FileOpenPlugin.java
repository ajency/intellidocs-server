/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */
package com.plugins;

import java.io.File;

import org.apache.cordova.DroidGap;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.net.Uri;
import android.webkit.MimeTypeMap;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;

public class FileOpenPlugin extends CordovaPlugin {

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action        The action to execute.
     * @param args          JSONArry of arguments for the plugin.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              A PluginResult object with a status and message.
     */
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackId) {
    	
    	   	
        PluginResult.Status status = PluginResult.Status.OK;
        String result = "";

        try {
            if (action.equals("openFile")) {
                result = this.openFile(args.getString(0));
                if (result.length() > 0) {
                    status = PluginResult.Status.ERROR;
                }
            }
            return new PluginResult(status, result) != null;
        } catch (JSONException e) {
            return new PluginResult(PluginResult.Status.JSON_EXCEPTION) != null;
        }
    }

    /**
     * Identifies if action to be executed returns a value and should be run synchronously.
     *
     * @param action    The action to execute
     * @return          T=returns value
     */
    public boolean isSynch(String action) {
        return false;
    }

    /**
     * Called by AccelBroker when listener is to be shut down.
     * Stop listener.
     */
    public void onDestroy() {
    }

    
    
    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    public String openFile(String fileName) {
    	
    	File file = new File(fileName);
        if (file.exists()) {
        	try {
        		String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(MimeTypeMap.getFileExtensionFromUrl(fileName));
	        	Uri path = Uri.fromFile(file);
	            Intent intent = new Intent(Intent.ACTION_VIEW);
	            intent.setDataAndType(path,mimeType);
	            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
	            
                //intent.setData(Uri.parse(fileName));
                (this.cordova.getActivity()).startActivity(intent);
                return "";
            } catch (android.content.ActivityNotFoundException e) {
                System.out.println("PdfViewer: Error loading url "+fileName+":"+ e.toString());
                return e.toString();
            }            

        }else{
        	return "file not found";
        }
    	
    	
    	
        
    }

}
