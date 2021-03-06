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

/**
 * This object is a pure service for the StrategySetBuilder. It handles the storage of
 * GitHubFacade handler tokens. It is a simple and general wrapper on a hash. Thus, it
 * can be used for other purposes but at time of writing (9/8/2014) it is only used for
 * the builder.
 *
 * Keys can be any string except null empty or contain whitespace.
 */

function TokenPool(){
    this.tokens = {};
}

exports.INVALID_KEY = "INVALID_TOKEN_KEY";
exports.INVALID_TOKEN = "INVALID_TOKEN";
exports.DUPLICATE_KEY = "DUPLICATE_TOKEN_KEY";

/**
 * Add token to pool with unique key.
 * @param {string} key the unique key to identify the token in this pool. Must not be null, empty or contain whitespace
 * @param {object} token the thing that the key identifies. Must not be null. Just a string in Set Buolder
 */
TokenPool.prototype.addToken = function (key, token) {
    if(!key || key.match(/\s+/) ){
        throw Error(this.INVALID_KEY);
    }
    if(this.tokens[key]){
        throw Error(this.DUPLICATE_KEY);
    }
    if(!token){
        throw Error(this.INVALID_TOKEN);
    }
    this.tokens[key] = token;
};

/**
 * This is pretty self explanatory
 * @param string key the key that identifies the token
 * @return object the token object identified by the key.
 */
TokenPool.prototype.getByKey = function (key) {
    return this.tokens[key] || false;
};

/**
 * This is pretty self explanatory
 * @param string key the key that identifies the token
 * @return boolean true if the key was successfully deleted. Only fails is the delete keyword fails or if the key does not exist
 */
TokenPool.prototype.removeTokenByKey = function (key) {
    return (delete this.tokens[key]);
};

/**
 * @return {[string]} Returns an array of all the keys that are currently in the pool.
 */
TokenPool.prototype.tokenKeys = function () {
    return Object.keys(this.tokens);
};

/**
 * @return {[object]} Returns all token objects currently in the pool. Does not return key with it.
 */
TokenPool.prototype.allTokens = function () {
    var self = this;
    return this.tokenKeys().map(function (key) {
        return self.tokens[key];
    });
};


module.exports = TokenPool;
