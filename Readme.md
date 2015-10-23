# hybris Store Template for the Cloud-based Commerce Services

This project is an e-commerce front-end written in AngularJS that is meant to showcase the available commerce services and
serve as starting point for creating a customized store front.


## Installation

The following steps will demonstrate how to install and run the code on localhost.  At the end, you will be able to browse and "shop" in 
a pre-configured store.  Feel free to take items through checkout, using any Stripe test credit card number (https://stripe.com/docs/testing).

###  1. System requirements

Install node and npm:

	$ brew install node	# on MacOS

[Or download from the Node site] (http://nodejs.org/)

Install grunt:

	$ npm install -g grunt-cli

Install bower:

	$ npm install -g bower

### 2. Project requirements

Create a fork of the repository, clone it to your machine, and ensure you are on the 'master' branch.  **Master** will be kept in sync with service dependencies deployed to prod. **Develop** will change frequently, and may contain experimental features and code changes against services that are only available in development and test environments.

To locally install the project, execute:

	$ npm install
	$ npm update 


### 3. Project startup

Start the project on localhost:9000 by executing:

	$ npm start

This will launch a storefront for an existing project against the "prod" environment.  Later, we will modify the application to go against your own project.


## Customization

Now, let's create a new project for your specific site so that you can modify your store and product offering as you see fit.

### 1.  Sign up for your a new store and configure it
If you haven't done so already, create a new storefront project and obtain subscriptions for the services.
Follow the steps outlined in the Dev Portal https://devportal.yaas.io/gettingstarted/setupastorefront/index.html

### 2.  Replace the default project id in the code base with your own (see project adminstration settings in the Builder).
In gruntfile.js, set the PROJECT_ID to your own project ID. When you build the project, the default project id in bootstrap.js will be replaced with your project-id. At this time you will need to also configure the CLIENT_ID and REDIRECT_URI gruntfile variables with the values set in the application associated with your project.

### 3.  Launch a new session 
Execute command "npm start" and open your browser at http://localhost:9000.  You should now see your customized store.

### 4.  Customize the style or logic of your storefront as desired
You can now modify the style or logic of your storefront.  Any new JS scripts or CSS files need to be added to index.html.

### 5. Project deployment

Preparing project for deployment (concatenation/minification/revisioning):

	$ grunt build:prod

    or

    $ grunt build


The :prod parameter specifies which dynamic domain to connect with the api services.  If this domain is not specified with the parameter, a warning will appear in the build output and the default setting will be applied for the api url's, which is also set to the prod api domain in the gruntfile.

**npm start** is configured to run **grunt build:prod**. Other options are **:stage** and **:test** and can be configured in the gruntfile.

Credential parameters also exist for automated build environments. With NPM 2.0, it is possible to pass in a Client_Id and Project_Id from npm run-script command line. For example, we can further automate the build system with these parameters (pid and cid) like this: 

$ npm run-script singleProd -- --pid=abc --cid=123

This allows for many different projects with many different clients to be configured. But remember that a minimum version of NPM 2.0 is required to pass the parameters, otherwise the Client_Id and Project_Id will be set by default to the build configuration variables in the gruntfile.


**grunt build** will also optimize js and css in public/index.html. See the optimization section for more specific information.


### 6.  Deploy application to server

You can deploy your web application to any server desired.  If you have access to a CloudFoundry environment and you're running the app in single project mode (default),
you can easily deploy your project using a [static buildpack](https://github.com/cloudfoundry-community/staticfile-buildpack) that utilizes [ngnix](http://nginx.org).  The configuration for this deployment is determined by settings in file static-manifest.yml (see http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html). You must change the name and domain of your store to match the domain given to your project. Attempting to push as is will result in error.

cf push -f static-manifest.yml

#  About This Project

## Limitations in the current service layer

- Limited tax support - consult APIs for details.

## Project Organization

The project has been structured into domain modules under public/js/app.  Within each module, files are organized into
 controllers, directives, services, and templates.  API REST calls are made from the domain services.

Third party dependencies are copied to public/js/vendor via the bower-installer command as part of the npm postinstall target
(see package.json file).

The angular bootstrapping takes places in file public/js/bootstrap.js.

From here, angular will load the "ds.app" module which comprises file public/js/app/app.js. It is here that the application
is further configured before it is loaded.

The app-config.js file provides dynamic configuration for the application which allows you to set application variables without persisting 
them in your get repository. For example, if you are running with multiple project id's changing between these environments will cause git to indicate an update. This scenario is avoided in app-config as it is included in .gitignore. Another example of non-persisted dynamic configuration is in the URL path to the API. Should this need to change, you will not need to persist it in git.


## Application Events

The following application events are used to communicate state changes that affect the entire application overall.  Interested controllers can subscribe to these events.

- **'cart:updated'** - fired when new cart information has been acquired from the service; 
    - event object:
        - cart - current cart instance
        - source - source event of the update (manual | currency | language | merge | reset)
- **'language:updated'** - fired when the store's language has changed
    - event object:
        - languageCode: new language code
        - source: source of the event
- **'currency:updated'** - fired when the store's currency has changed
    - event object:
        - currencyId: new currency id
        - source: source of the event
- **'categories:updated'** - fired when categories have been reloaded
    - event object:
        - categories: new category tree
        - source: reason for category update
- **'user:signedin'** - signals that a user has been authenticated
- **'user:signedout'** - signals that a user has logged off
- **'user:socialLogIn'** - signals change via social login (both the external authentication as well as the subsequent yaas authentication)
    - event object:
        - loggedIn: true/false
- **'category:selected'** - signals that a given category was navigated to.  Event object has property 'category' to indicate selection.

## Running Against Different Environments

The service endpoint domains can be configured for a specific environment by specifying the desired target in the npm/grunt commands. The endpoint URLs are configured in public/js/app/shared/site-config.js.  When running grunt, the domain is injected into this configuration file via String replacement. The default environment is "prod", so you can simply invoke **grunt build** and **npm start** to build or build and run the application against the services in the **prod** environment.

Additional api environments supported by the script are:
    - test
    - stage

To build against an environment other than **prod**, append **:[env]** to the grunt task you're calling. For instance, to invoke the build for **test**, you issue the command **grunt build:test**.  To build and run the app via NPM against **stage**, you'll call **grunt build:stage**.

## Testing

Tests are grouped by unit tests, end-to-end tests and styling tests under the "test" folder.  Unit tests can be run via
the scripts/test.sh; end-to-end tests can be run via scripts/e2e-test.sh.  Unit test code coverage is published to folder "coverage"
after running the unit test suite.

## Adding Locales

There are two distinct localization settings related to the store:  there are the language preferences that are configured in Builder, and then there are translations for all static information that's displayed in a store.  The Builder settings determine the language preferences for data retrieved through services, as well as the available language options that shoppers can select in the store.  The static information (button labels, instructions, etc) are provided in constant files in the code base - see **public/js/app/shared/i18/lang**.  Out of the box, the project currently only provides data in English and in German.  If the preferred language is supported by the app localization settings, it will be selected; otherwise, the static localization will be presented in English.  To support additional languages, provide your own localized constants and load the data in **public/js/app/shared/i18n/providers/translation-providers.js**.

## Multi-Project Mode

This project contains the capability to run the same deployed store template against multiple configured storefronts. In order to do so, start the server by calling  "npm run-script multiProd".  This will start up the Express.JS server configured in file multi-tenant/multi-tenant-service.js. The multi-project mode is provided for development and test purposes only.

In the multi-project setup, instead of reading the project ID from bootstrap.js, the project-id is the first path segment in the URL. For example, to run the store against project "myproject" you would use the URL: 

    http://localhost:9000/myproject.

## Security

### DevPortal Security Documentation

A variety of precautions have been taken to ensure information security in the demostore. For a full list of those capabilities, please see the DevPortal Security Documentation at https://devportal.yaas.io/overview/security/storefrontsecurity.html Below is a brief on a few or our recomendations.

### y-input

One personalized security choice you have is for the custom data wrapper directive called y-input. It gives you the ability to finely tune regular expression input checking types for specific fields, like email, password, id, etc... as added ensurance against XSS.

### Angular Version

It is a good idea to ensure your Angular version dependencies are above 1.2 to gain the $SCE (strict contextual escaping) that is added by default in that version. For example, you should specify your angular build version in some variety(latest) greater than 1.2 like so:
  "dependencies": {
    "angular": "~1.3.0"


### Click-Jacking

It is recommended that you configure your deployment HTTP server to send the X-FRAME-OPTIONS header to restrict others from hosting your site inside an IFrame.
See [OWASP Click-Jacking]

    (https://www.owasp.org/index.php/Clickjacking).

### HTTPS

We strongly recommend domains that are encrypted into a Secure Socket Layer (SSL) HTTPS session. Possibly also a forced redirect is optimal to ensure that all http users are converted into encrypted streams. For example of this see the configuration in the NodeJS server file located at: server/singleProdServer.js


### OWASP

For more information on any of these topics see OWASP. For starters, here is a good checklist of guidlines and an industry resource for Information Security best practices:

    https://www.owasp.org/index.php/Web_Service_Security_Cheat_Sheet

## Optimization

Performance optimizations are included in the gruntfile to improve the initial load time of the site. There is an 'optimizeCode' grunt task which concatenates and minifies JavaScript and CSS to reduce HTTP requests and the overall page size of the application. It works by pulling all the code from the development files into the .tmp directory, where it then concatenates and minifies before moving it to a final destination in the /dist directory. The 'optimizeCode' build task conducts all operations required with producing an optimized run-time, including: cleaning of /dist, copying of dependencies, and the replacement of the concatenated and minified resources. The code within the /dist directory then contains everything needed to run an optimized store front. To deploy those optimized resources, first run a build command that will populate the /dist directory with the optimized files (like **grunt build** for example) then deploy /dist to your server of choice and run **grunt startServer**. The startServer build task gives you the choice to run either a multi-project site or a single-project site with the flags --single or --multiple. It will start the server with only the minimum build steps necessary (including server-side optimizations),  excluding unecessary build tasks like linting.

A short list of the performance optimizations available are: JS & CSS minification, file revisioning, http template caching, and GZip in the NodeJS server.


## Modularity

At the core of what AngularJS is getting right, right now, are modules and components. The storefront architecture was design in best-practice manner to allow extensibility along any folder in the physical architecture. This is done by grouping files by Component first, then by language Type. So for example, a 'SomeFeature' folder that contains controllers, directives, services, templates. This structure allows reuse in the ability to add and differentiate any number of similar but different html, controllers, directives, etc. All the way up to the very top of the application in the bootstrap.js file. Where it is possible to partition and run in parallel separate variations of the codebase through manual variation of the base module in the angular.bootstrap parameter:

    angular.bootstrap( document, ['ds.app'] );

### Extensibility Plan

The nice thing about the structure of AngularJS is that it gives you the ability to differentiate your business requirements into the architecture without ever having to touch the original codebase. This is possible if you are replicating the pieces that you need in parallel with the existing structure - like a scaffolding. For example before you make any modifications to say the gruntfile or the package.json - you should really split the That way, pulling down advancements in the demostore can be isolated to files that you are never using in production. Admittedly, this parallel replication process is low ceremony, but it becomes really helpful in extending the codbase year after year of feature implementation and sales growth. All while having a fully updated hybris demostore supporting your advancement while you develop. Those topics and more are discussed at the following DevPortal location:

    https://devportal.yaas.io/overview/extensibility/extendingthestorefront.html


# Resources

For in-depth API documentation, please visit:

    https://devportal.yaas.io/

## About this Project

### Why AngularJS?

With the rapid growth in JS frameworks, it is not feasible to evaluate all options, and it is still difficult to make a choice
among a small subset of options.
We were looking for a single-page framework with industry and community traction, support for unit testing,
decoupling of DOM manipulation and application logic, and terseness.  AngularJS fit these requirements very nicely.
Ultimately, the hybris commerce services support all needed business logic, and new client applications can be created with ease as needed.

### Why Node?

We wanted to take advantage of the Node package manger, NPM, for resolving our infrastructure dependencies.  In addition,
the Node based HTTP server turned out to be very quick to start up and thus ideal for development.

The multi-project mode relies on NodeJS with Express so that dynamic routes can be created for multiple storefronts.
The single-project distribution generated by this project, however, can be deployed on any HTTP server, without NodeJS.

### Infrastructure Tools

- [Bower](http://bower.io/) - package manager for all dependent libraries on the browser side
- [Grunt](http://gruntjs.com/) - JS task runner
- [Karma](http://karma-runner.github.io/) - test runner for AngularJS
- [Jasmine](http://jasmine.github.io/) - JS unit test framework
- [Protractor](https://github.com/angular/protractor) End-to-End (E2E) test framework for AngularJS
- [PhantomJS](http://phantomjs.org/) headless WebKit used for our E2E tests
- [Less](http://lesscss.org/) CSS pre-processor


### AngularJS And Other UI Packages
For a complete and up-to-date list of UI dependencies, please examine file bower.json.
- [Angular.js](http://angularjs.org/) AngularJS framework
- [Angular UI router](https://github.com/angular-ui/ui-router) State-based routing framework that helps achieve loose coupling
between modules.
- [Bootstrap](http://getbootstrap.com/) Enables responsiveness using the Bootstrap responsive grid.
- [Angular Bootstrap](http://angular-ui.github.io/bootstrap/) AngularJS implementation for Bootstrap widgets (for instance, pagination).
- [Restangular](https://github.com/mgonto/restangular) Library simplifying access of REST services through Angular's $resource service.
- [ngInfiniteScroll](http://binarymuse.github.io/ngInfiniteScroll/) Infinite scrolling in AngularJS. Used for the "browse product" pages.

### About Contributions
 
We encourage contributions in the form of pull requests against the master branch of this repository.  Your pull request will be reviewed by a member of the hybris organization.

### License
 
See the License.md file for complete license information.












