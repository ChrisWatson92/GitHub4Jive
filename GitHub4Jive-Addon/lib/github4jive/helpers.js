/*
 * Copyright 2014 Jive Software
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

exports.getDiscussionForIssue = function (jiveApi, placeURL, issueId){
    // -> GET [jiveURL]/api/core/v3/extprops/github4jiveIssueId/[issueID]
    return jiveApi.getByExtProp("github4jiveIssueId", issueId).then(function (contents) {
        var toReturn = null;
        if(contents.list){
            contents.list.forEach(function (discussion) {
                if(discussion.parent == placeURL){
                    toReturn = discussion;
                    return discussion;
                }
            });
        }
        return toReturn;
    });
};
