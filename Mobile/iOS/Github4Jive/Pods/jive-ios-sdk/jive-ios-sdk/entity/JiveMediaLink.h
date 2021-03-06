//
//  JiveMediaLink.h
//  jive-ios-sdk
//
//  Created by Rob Derstadt on 10/24/12.
//
//    Copyright 2013 Jive Software Inc.
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//    http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//

#import <Foundation/Foundation.h>
#import "JiveObject.h"

//! \class JiveMediaLink
//! https://developers.jivesoftware.com/api/v3/rest/MediaLinkEntity.html
@interface JiveMediaLink : JiveObject

//! Hint to the consumer about the length, in seconds, of the media resource identified by the url field.
@property(nonatomic, readonly) NSNumber *duration;

//! Hint to the consumer about the height, in pixels, of the media resource identified by the url field.
@property(nonatomic, readonly) NSNumber *height;

//! Hint to the consumer about the width, in pixels, of the media resource identified by the url field.
@property(nonatomic, readonly) NSNumber *width;

//! URI of the media resource being linked.
@property(nonatomic, readonly) NSURL* url;

@end
