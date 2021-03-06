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

var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var chaiAsPromised = require("chai-as-promised");
var q = require("q");
var sinon = require('sinon');

chai.use(chaiAsPromised);
var jive = require("jive-sdk");
var JiveFacadeLoader = require("github4jive/JiveApiFacade");
var JiveBasicLoader = require("github4jive/JiveBasicAuth");
var JiveOAuthLoader = require("github4jive/JiveOauth");
var ContentBuilder = require("github4jive/JiveContentBuilder");

var community = {jiveUrl: "http://localhost:8080"};
var tempOAuthToken = jive.util.guid();
var tempOAuthRefreshToken = jive.util.guid();
var basic = new JiveBasicLoader("admin", "admin");

var counter = 1;

function createContent(jiveFacade, type, notQuestion) {
    var content = {type: type,
        content: {
            type: "text/html",
            text: "<h1>WooHOO</h1>"},
        subject: "YAHOO" + counter++
    };
    if(type == "discussion" && !notQuestion){//stupid I know
        content.question = true;
    }
    return jiveFacade.create(content);
}
describe("JiveApiFacade", function () {
    var jiveFacade = new JiveFacadeLoader(community, basic);

    it("should not be null", function () {
        should.exist(jiveFacade);
    });

    beforeEach(function() {
        jive = require("jive-sdk");
        jive.context.persistence =  new jive.persistence.memory();

        this.sandbox = sinon.sandbox.create();
        this.sandbox.inject(this);
    });

    afterEach(function() {
        this.sandbox.restore();
    });

    var createdID;
    describe("#create", function () {
        it("should return an object with an id and then be able to delete it", function () {
            var contentID = 1000;
            this.stub(jive.util, "buildRequest", function( url, method, postBody, headers ) {
                // test basic auth
                if ( headers['Authorization'] !== basic.applyTo(null, null, {})['headers']['Authorization'] ) {
                    return q.reject({ 'statusCode': 400 });
                }

                // if post, then return entity for contentID 1000 (expected by the test)
                if ( method === 'POST' ) {
                    return q({
                        'statusCode' : 201,
                        'entity' : {
                            'resources' : {
                                'self' : {
                                    'ref' : community.jiveUrl + '/api/core/v3/contents/' + contentID
                                }
                            }
                        }
                    });
                } else {
                    return q({
                        'statusCode' : url.indexOf('/contents/' + contentID) > -1 ? 204  : 500
                    });
                }
            });

            return createContent(jiveFacade, "discussion").then(function (response) {
                response.should.have.property("success").and.be.true;
                response.should.have.property("apiID");
                createdID = response.apiID;
                return jiveFacade.destroy(createdID).then(function (response) {
                    response.statusCode.should.equal(204);
                });
            }).catch(function (error) {
                throw error;
            });
        });
    });

    describe("#attachPropsToContent", function () {
        it("should return true when complete", function () {
            var oAuth = new JiveOAuthLoader(null,tempOAuthToken ,tempOAuthRefreshToken);
            var oAuthFacade = new JiveFacadeLoader(community,oAuth);

            this.stub(jive.community, "findByCommunity").returns(q(community));

            // simulate what the Jive server is expected to return
            var contentID = 1000;
            this.stub(jive.util, "buildRequest", function( url, method, postBody, headers ) {
                // test basic auth
                if ( headers['Authorization'] !== 'Bearer ' + tempOAuthToken ) {
                    return q.reject({ 'statusCode': 400 });
                }

                // if post, then return entity for contentID 1000 (expected by the test)
                if ( method === 'POST' ) {
                    return q({
                        'statusCode' : 201,
                        'entity' : {
                            'resources' : {
                                'self' : {
                                    'ref' : community.jiveUrl + '/api/core/v3/contents/' + contentID
                                }
                            }
                        }
                    });
                } else if ( method === 'DELETE' ) {
                    return q({
                        'statusCode' : url.indexOf('/contents/' + contentID) > -1 ? 204  : 500
                    });
                } else if ( method === 'GET' ) {
                    if ( url.indexOf(community.jiveUrl + '/api/core/v3/extprops/gitID/1234') == 0 ) {
                        return q({
                            'statusCode' : 200,
                            'entity' : {
                                'list': [
                                    {
                                        'resources' : {
                                            'extprops' : {
                                                'allowed' : ['GET'],
                                                'ref' : community.jiveUrl + '/api/core/v3/contents/' + contentID
                                            }
                                        }
                                    }
                                ]
                            }
                        });
                    }
                    if ( url.indexOf(community.jiveUrl+ '/api/core/v3/contents/' + contentID ) == 0 ) {
                        return q({
                            'statusCode' : 200,
                            'entity' : {
                                'resources' : {
                                    'self' : {
                                        'ref' : community.jiveUrl + '/api/core/v3/contents/' + contentID
                                    }
                                }
                            }
                        });
                    }
                }
            });

            return createContent(oAuthFacade, "discussion").then(function (response) {
                var contentID = response.apiID;
                return oAuthFacade.attachPropsToContent(contentID,{gitID: 1234}).then(function (response) {
                    response.should.have.property("success");
                    response.success.should.be.true;
                    return oAuthFacade.getByExtProp("gitID", 1234).then(function (response) {
                        return q.all(response.list.map(function (content) {
                                content.should.have.property("retrieveAllExtProps").and.be.a("function");
                                return content.retrieveAllExtProps().then(function (props) {
                                    Object.keys(props).length.should.be.above(0);
                                })
                            })).then(function () {
                            return oAuthFacade.destroy(contentID).then(function (response) {
                                response.statusCode.should.equal(204);
                            });
                        });
                    })
                })
            });

        })
    });

    describe("#replyToDiscussion", function () {
        it("should return response when done", function () {
            var contentID = 1000;
            this.stub(jive.util, "buildRequest", function( url, method, postBody, headers ) {
                // test basic auth
                if ( headers['Authorization'] !== basic.applyTo(null, null, {})['headers']['Authorization'] ) {
                    return q.reject({ 'statusCode': 400 });
                }

                // if post, then return entity for contentID 1000 (expected by the test)
                if ( method === 'POST' ) {
                    return q({
                        'statusCode' : 201,
                        'entity' : {
                            'resources' : {
                                'self' : {
                                    'ref' : community.jiveUrl + '/api/core/v3/contents/' + contentID
                                }
                            }
                        }
                    });
                } else {
                    return q({
                        'statusCode' : url.indexOf('/contents/' + contentID) > -1 ? 204  : 500
                    });
                }
            });

            return createContent(jiveFacade, "discussion").then(function (response) {
                var contentID = response.apiID;
                var builder = new ContentBuilder();
                var message = builder.message().body("DSAFDFDS").build();
                return jiveFacade.replyToDiscussion(contentID, message).then(function (response) {
                    return jiveFacade.destroy(contentID);
                })
            });
        });

    });

    describe("#markFinal", function () {
        it("should return an outcome object", function () {

            return createContent(jiveFacade, "discussion").then(function (response) {
                var contentID = response.apiID;
                return jiveFacade.markFinal(contentID).then(function (response) {
                    response.success.should.be.true;
                    response.entity.should.be.an("object");
                    response.entity.id.should.be.above(0);

                    jiveFacade.getOutcomes(contentID).then(function (outcomes) {
                        outcomes.entity.list.length.should.be.above(0);
                        outcomes.entity.list[0].id.should.be.above(0);
                        return jiveFacade.destroy(contentID);
                    })


                })
            });
        })
    });

    describe("#unMarkFinal", function () {
        it("should return success and remove the final outcome", function () {
            return createContent(jiveFacade, "discussion").then(function (response) {
                var contentID = response.apiID;
                return jiveFacade.markFinal(contentID).then(function (response) {
                    response.success.should.be.true;
                    return jiveFacade.unMarkFinal(contentID).then(function (response) {
                        response.success.should.be.true;
                        return jiveFacade.destroy(contentID);
                    })

                })
            });
        })
    });

    describe("#answer", function () {
        it("should mark the question assumed answered", function () {
            return createContent(jiveFacade, "discussion").then(function (content) {
                var contentID = content.apiID;
                return jiveFacade.answer(content.entity).then(function (response) {
                    response.success.should.be.true;
                    response.entity.should.be.an("object");
                    response.entity.id.should.be.above(0);
                    response.entity.resolved.should.equal("assumed_resolved");
                    jiveFacade.destroy(contentID);
                }).catch(function (error) {
                    jiveFacade.destroy(contentID);
                    throw error;
                });
            });
        });

        it("should throw if the discussion isn't marked as a question", function () {
            var contentID;
            return createContent(jiveFacade, "discussion", true).then(function (content) {
                contentID = content.apiID;
                 expect(function () {
                    return jiveFacade.answer(content.entity);
                }).to.throw("This discussion is not a question.");
                jiveFacade.destroy(contentID);
                }).catch(function (error) {
                    jiveFacade.destroy(contentID);
                    throw error;
                 });
            });

    });

    describe("#removeAnswer", function () {
        it("should remove assumed answer marking and unmark any reply that is marked", function () {
            return createContent(jiveFacade, "discussion").then(function (content) {
                var contentID = content.apiID;
                return jiveFacade.answer(content.entity).then(function (response) {
                    response.success.should.be.true;
                    return jiveFacade.removeAnswer(content.entity).then(function (response) {
                        response.success.should.be.true;
                        return jiveFacade.get(response.entity.discussion).then(function (response) {
                            response.entity.resolved.should.equal("open");
                            jiveFacade.destroy(contentID);
                        });


                    }).catch(function (error) {
                        jiveFacade.destroy(contentID);
                        throw error;
                    });

                });
            });
        });
    });

    describe("#update", function () {
        function createTags(content,tags) {
                var builder = new ContentBuilder(content.entity);
                var update = builder.tags(tags).build();

                return jiveFacade.update(update).then(function (response) {
                    response.success.should.be.true;
                    response.entity.tags.should.be.an("array");
                    response.entity.tags.length.should.equal(tags ? tags.length : 0);
                    if(tags) {
                        tags.forEach(function (tag) {
                            response.entity.tags.should.contain(tag);
                        });
                    }
                    return response;
            });
        }

        it("should add tags", function () {
            var tags = ["bug", "enhancement"];
            var contentID = null;
            return createContent(jiveFacade, "discussion").then(function (content) {
                contentID = content.apiID;
                return createTags(content,tags)
                return jiveFacade.destroy(contentID);


            }).catch(function (error) {
                jiveFacade.destroy(contentID);
                throw error;
            });
        });

        function updateTagsTest(contentID, tags, targetTags) {
            return createContent(jiveFacade, "discussion").then(function (content) {
                contentID = content.apiID;
                return createTags(content, tags).then(function (update) {
                    return createTags(update, targetTags);
                }).then(function () {
                    return jiveFacade.destroy(contentID);
                });

            }).catch(function (error) {
                jiveFacade.destroy(contentID);
                throw error;
            });
        }

        it("should remove tags when tags are empty", function () {

            var tags = ["bug", "enhancement"];
            var contentID = null;
            return updateTagsTest(contentID, tags, []);

        });

        it("should remove tags when tags are null", function () {
            var tags = ["bug", "enhancement"];
            var contentID = null;
            return updateTagsTest(contentID, tags, null);


        });
    });


});

