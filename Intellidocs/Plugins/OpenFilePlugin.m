//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//  Copyright 2012, Randy McMillan

#import "OpenFilePlugin.h"
#import <Cordova/CDVViewController.h>



@implementation OpenFilePlugin

- (void) viewFile:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options // args: url
{
    //NSlog(@"Open file will work");
    //breaking the plugin here
    NSString *url = (NSString*) [arguments objectAtIndex:0];
    NSURL *fileURL = [NSURL fileURLWithPath:url];
    UIDocumentInteractionController *docController = [UIDocumentInteractionController interactionControllerWithURL:fileURL]; //url is the file url saved inside my application.
    docController.delegate = self;
    [docController retain];
    
    
    bool didShow = [docController presentOpenInMenuFromRect:CGRectZero inView:self.webView animated:YES];
    
    
     
    if (!didShow) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@""
                                                        message:@"Sorry. Appropriate apps were not found on device." 
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles: nil];
        [alert show];
    }
}
@end