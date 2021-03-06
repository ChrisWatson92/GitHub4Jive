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

var jive = require("jive-sdk");

var libDir = process.cwd() + "/lib/";
var GitHubWebhookBuilder = require(libDir + "github4jive/GitHubWebhookBuilder");
var placeStore = require(libDir + "github4jive/placeStore");

////////////////////////////////////////////////////////////////////////////////////////////////////
// create a webhook processor and attaching event handlers to it

var issueHandler = require("./issueHandler"); // listen for issue create/close events and push updated issues to the tile

module.exports = new GitHubWebhookBuilder(
    //
    [ issueHandler ],

    // equivalence tests for unique tile instances
    function(lhs, rhs) {
        return lhs.config.parent === rhs.config.parent;
    },

    //
    setupInstanceHandler, tearDownInstanceHandler
);

/**
 * Required by issueHandler#setup
 */
function setupInstanceHandler(tileInstance){
    var placeURL = tileInstance.config.parent;
    return placeStore.getPlaceByUrl(placeURL).then(function (place) {
        return {
            owner: place.github.repoOwner,
            repo: place.github.repo,
            gitHubToken: place.github.token.access_token,
            placeUrl: place.placeUrl,
            instance: tileInstance
        };
    });
}

/**
 * Required by issueHandler#setup
 */
function tearDownInstanceHandler(tileInstance) {
    var placeURL = tileInstance.config.parent;
    return placeStore.getPlaceByUrl(placeURL).then(function (place) {
        return {
            placeUrl: place.placeUrl,
            gitHubToken: place.github.token.access_token
        };
    });
}
