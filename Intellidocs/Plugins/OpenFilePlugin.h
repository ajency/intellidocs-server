
//  Created by Suraj Air on 02-07-12.
//  Copyright 2010 www.ajecny.in. All rights reserved.


#import <Cordova/CDVPlugin.h>

@interface OpenFilePlugin : CDVPlugin <UIDocumentInteractionControllerDelegate>  {
        
}

-(void) viewFile:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
