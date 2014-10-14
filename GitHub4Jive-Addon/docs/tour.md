# GitHub4Jive Sequences and Code Refs

## Browsing GitHub Issues in Jive

Using a Place Tab to view GitHub issues in Jive

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/place1.jpg "Issue Browser")

* **Sequence 1 Code:** Capture GitHub access tokens
  * [Service structure](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon)
  * [App contributes a place confi modal view](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/app.xml#L83)
  * [App config modal HTML](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/place-config.html)
  * [App config modal JS launches 3-legged OAuth with Jive & GitHub)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/public/javascripts/configurePlace.js#L199)
  * Browser invokes service endpoint for storing GitHub access token
    * [Service endpoint definition](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/routes/gitHubEndpoints.js#L114)  
    * [Service controller stores GitHub access token](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubOAuthController.js#L42)
  * Browser invokes service endpoint for capturing Jive access
    * [Service endpoint definition](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/routes/jiveEndpoints.js#L44)
    * [Service controller stores Jive access token](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/jiveOAuthController.js)

* **Sequence 2 Code:** Browse ist of all repo issues via embedded app view within a Purposeful Place tab
  * [App contributes a tab into places](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/app.xml#L101)
  * [HTML of the issues tab](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/place-tab.html)
  * [Tab JS calls service to fetch issues from GitHub](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/javascripts/actions/place-tab.js#L23)
  * [Service endpoint for proxied issues fetch](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/routes/gitHubEndpoints.js#L52)
  * [Controller fetches place details from service place store](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubController.js#L84)
  * [Place store finds local record](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/placeStore.js#L115)
  * [Place store fetches and caches external props for the place](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/placeStore.js#L79)
  * [Reminder of where the external props were set -- in the configuration modal](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/public/javascripts/configurePlace.js#L199)
  * [Controller uses external props for access to the linked GitHub repo, and fetches issues](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubController.js#L86)
  * [Tab JS gets list of issues and updates the DOM](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/javascripts/actions/place-tab.js#L30)

## Managing GitHub Issues in Jive

Using Tiles in a Purposeful Place to track GitHub issues 

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/issues1.jpg "Issue Management 1")

* **Sequence 3 & 4 Code:** Jive tile registration --> setup GitHub webhooks
  * [Tiles directory](https://github.com/jivesoftware/GitHub4Jive/tree/master/GitHub4Jive-Addon/tiles)
  * [Service handles tile registration from Jive](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/controller.js#L54)
  * [Tile registration handler sets up GitHub webhooks processor](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/webhooks/webhookProcessor.js)
  * [GitHub issue state change webhook handler](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/webhooks/issueHandler.js)
  * [Service subscribes to GitHub repo events](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L211)

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/issues2.jpg "Issue Management 2")

* **Sequence 5 Code:** Create GitHub issue --> Update Jive tiles
  * [GitHub calls service endpoint](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/routes/gitHubEndpoints.js#L28)
  * [Service forwards to GitHub facade to find event handlers](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubController.js#L40)
  * [Execute registered event handlers](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L306)
  * [Execute recent Issues tile datapush handler](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/webhooks/issueHandler.js#L38)
  * [Push recent issues to Jive](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/tileInstanceProcessor.js)
  * [GitHubFacade fetches most recent repo issues from GitHub](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L125)
  
![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/issues3.jpg "Issue Management 3")

* **Sequence 6 & 7 Code:** Close GitHub issue via tile action --> update Jive tiles
  * [Define tile action context as part of tile push](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/tileInstanceProcessor.js#L77)
  * [Define the tile entry action route (powers the modal)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/backend/routes/action/get.js)
  * [Tile entry action modal HTML (front end)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/public/action.html)
  * [Tile entry action modal JS - close an issue (front end)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/tiles/github-issues-recent/public/javascripts/action.js#L84)
  * [Endpoint for proxying close issue calls to GitHub](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/routes/gitHubEndpoints.js#L66)
  * [Service performs close issue proxy call to GitHub](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubController.js#L143)
  * [Github facade call to GitHub for close issue operation](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L158)
  * [GitHub calls service webhook, issue handler updates recent issues tile](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js)


## Issue Discussions

Using a Jive discussion to comment on a GitHub issue

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/discussions1.jpg "Issue Discussions 1")

* **Sequence 8 & 9 Code:** Create GitHub issue --> Create Jive discussion
  * [Config modal JS calls place setup endpoint (front end)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/public/javascripts/configurePlace.js#L255)
  * [Endpoint for triggering place setup](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/routes/placeEndpoints.js#L22)
  * [Kick off GitHub and Jive webhooks setup](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/placeController.js#L80)
  * [GitHub webhook processor defines an issue handler](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/webhookProcessor.js)
  * [Issue Handler creates a Jive discussion when invoked on GitHub issue creation](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js#L51)
  * [Issue Handler calls Jive to write ext props linking discussion to the issue](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js#L107)
  * [Create a Jive discussion entity](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/JiveContentBuilder.js#L88)
  * [Create extended props for Jive discussion (binding it to remote GitHub issue)](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js#L70)
  * [Call Jive to add extended props to Jive discussion](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/JiveApiFacade.js#L229)
  * [Invoke Jive APIs using access token, refresh if necessary](https://github.com/jivesoftware/jive-sdk/blob/master/jive-sdk-api/lib/community/community.js#L226)

* **Sequence 10 & 11 Code: Comment GitHub issue --> Jive Discussion reply**
  * [GitHub calls service webhook endoint, forwards to controller](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/routes/gitHubEndpoints.js#L28)
  * [Controller forwards GitHub event to GitHubFacade for processing](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/github/backend/gitHubController.js#L40)
  * [GitHubFacade invokes registered event handler](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L306)
  * [Place issue comment handler is invoked](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueCommentHandler.js#L42)
  * [Issue handler queries Jive for related discussion via ext props](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/helpers.js#L18)
  * [Issue handler creates a reply based on issue comment] (https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueCommentHandler.js#L66)
  * [Issue handler uses Jive api facade to create discussion reply](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/JiveApiFacade.js#L208)

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/discussions2.jpg "Issue Discussions 2")

* **Sequence 12 Code: Jive Discussion reply --> Comment on GitHub issue**
  * [Registered Jive service webhook](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/placeController.js#L107) 
  * [Jive invokes service webhook endpoint](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/routes/jiveEndpoints.js#L27)
  * [Endpoint delegates to controller](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/jiveController.js#L30)
  * [Controller forwards reply event to webhook processor, determines its a discussion reply, delegates to issue comment handler](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/webhooks/webhookProcessor.js#L74)
  * [Discussion Reply handler fetches jive discussion](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/webhooks/jiveCommentHandler.js#L38)
  * [Discussion Reply handler fetches discussion ext props to locate linked github issue](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/webhooks/jiveCommentHandler.js#L47)
  * [Discussion Reply handler uses GitHub facade to post a new comment on the issue](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/jive/backend/webhooks/jiveCommentHandler.js#L59)
  * [GitHub facade posts a new issue comment](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/lib/github4jive/gitHubFacade.js#L191)

## Issue Actions

Using Jive app actions to manage GitHub issues 

![](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/images/actions1.jpg "Issue Actions 1")

* **Sequence 13 Code: State-aware app actions**
  * [App location](https://github.com/jivesoftware/GitHub4Jive/tree/master/GitHub4Jive-Addon/apps/GitHub4Jive/public)
  * [Discussion app action definitions](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/apps/GitHub4Jive/public/app.xml#L59)
  * [Discussion ext properties are set](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js#L107)
  * [App action contribution reference](https://community.jivesoftware.com/docs/DOC-114464)

* **Sequence 14 Code: TBD**
  * [Jive calls service webhook endpoint]()
  * [Service endpoint calls GitHub to close issue]()
  * [GitHub calls service webhook endpoint]()
  * [Discussion ext properties are set, indicating closure](https://github.com/jivesoftware/GitHub4Jive/blob/master/GitHub4Jive-Addon/services/places/backend/webhooks/issueHandler.js#L123)