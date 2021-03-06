//
//  JiveLevel.h
//  jive-ios-sdk
//
//  Created by Jacob Wright on 10/29/12.
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

//! \class JiveLevel
//! https://developers.jivesoftware.com/api/v3/rest/LevelEntity.html
@interface JiveLevel : JiveObject

//! Description of the status level that this person has achieved.
@property(nonatomic, readonly) NSString* jiveDescription;

//! Name of the status level that this person has achieved.
@property(nonatomic, readonly) NSString* name;

//! Number of status level points that this person has achieved.
@property(nonatomic, readonly) NSNumber *points;

@end
