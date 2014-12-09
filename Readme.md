# hybris Store Template for the Cloud-based Commerce Services

This project is an e-commerce front-end written in AngularJS that is meant to showcase the available commerce services and
serve as starting point for creating a customized store front.


## Installation

The following steps will demonstrate how to install and run the code on localhost.  At the end, you will be able to browse and "shop" in 
a pre-configured store.  Feel free to take items through checkout, using any Stripe test credit card number (https://stripe.com/docs/testing).

Please do not invoke any POST or PUT requests against the default tenant by programmatic means or through a REST console.
You may do so after setting up your own tenant.

###  1. System requirements

Install node and npm:

	$ brew install node	# on MacOS

[Or download from the Node site] (http://nodejs.org/)

Install grunt:

	$ npm install -g grunt-cli

Install bower:

	$ npm install -g bower


### 2. Project requirements

To locally install the project execute:

	$ npm install
	$ npm update 


### 3. Project startup

Start the project on localhost:9000 by executing:

	$ npm start

This will launch a storefront for an existing tenant against the "test" environment.  Later, we will modify the application to go against your own tenant.


## Customization

Now, let's create a new tenant for your specific project so that you can modify your store and product offering as you see fit.

If you haven't done so already, create a new storefront project and obtain subscriptions for the services.

### 1.  Sign up for your a new store and configure it
Follow the steps outlined in the Dev Portal https://devportal.yaas.io/gettingstarted/createastorefront/index.html

### 2.  Replace the default tenant id in the code base with your own (see project adminstration settings in the Builder).  
In file public/js/bootstrap.js, replace the default "storeTenant" variable with your own project id.

### 3.  Launch a new session 
Execute command "npm start" and open your browser at http://localhost:9000.  You should now see your customized store.

### 4.  Customize the style or logic of your storefront as desired
You can now modify the style or logic of your storefront.  Any new JS scripts or CSS files need to be added to index.html
(and index.jade if you utilize the multi-tenant mode).

### 5. Project deployment

Preparing project for deployment (concatenation/minification/revisioning):

	$ grunt build:test

	    The :test parameter is required to set the dynamic domains of the api service.
	    If this domain is not specified with the parameter, it is very likely that the services will not be located.
	    npm start is configured to run grunt build:test. Other options are :stage and :prod and can be configured in the gruntfile.

Then on page public/index.html, remove the existing script references and replace them with references to the two 
generated static files from **dist** directory (dist/js/*.js, dist/css/*.css).

### 6.  Deploy application to server

You can deploy your web application to any server desired.  If you have access to a CloudFoundry environment and you're running the app in single tenant mode (default),
you can easily deploy your project using a [static buildpack](https://github.com/cloudfoundry-community/staticfile-buildpack)
 that utilizes [ngnix](http://nginx.org).  The configuration for this deployment is determined by settings in file static-manifest.yml (see http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html).

cf push -f static-manifest.yml

#  About This Project

## Limitations in the current service layer

- Limited tax support - consult APIs for details.

## Project Organization

The project has been structured into domain modules under public/js/app.  Within each module, files are organized into
 controllers, directives, services, and templates.  API REST calls are made from the domain services.

Third party dependencies are copied to public/js/vendor via the bower-installer command as part of the npm postinstall target
(see package.json file).

The angular bootstrapping takes places in file public/js/bootstrap.js.  It is here that you will configure some basic properties 
for the store front:
-"storeTenant" - the project id that identifies a particular store

From here, angular will load the "ds.route" module which comprises file public/js/app/app.js. It is here that the application
if further configured before it can be launched.

You may also notice file public/js/bootstrap-multi-tenant.js, which can be used to configure the app for multi-tenant mode
in an optional step.

## Application Events

-'cart:updated' - fired when new cart information has been acquired from the service; 
    event object:
        - cart - current cart instance
        - source - source event of the update (manual | currency | language | merge | reset)
-'language:updated' - fired when the store's language has changed
    event object:
        - languageCode: new language code
        - source: source of the event
-'currency:updated' - fired when the store's currency has changed
    event object:
        - currencyId: new currency id
        - source: source of the event
-'categories:updated' - fired when categories have been reloaded
    event object:
        - categories: new category tree
-'user:signedin' - signals that a user has been authenticated
-'user:signedout' - signals that a user has logged off
-'categories:updated' - signals that categories have been reloaded by Category Service 
-'category:selected' - signals that a given category was navigated to.  Event object has property 'category' to indicate selection.

## Running Against Different Environments

The service endpoint domains can be configured for a specific environment by specifying the desired target in the npm/grunt commands. 

The endpoint URLs are configured in public/js/app/shared/site-config.js.  When running grunt, the domain is injected into this configuration file via String replacement.

The default environment is "test", so you can simply invoke **grunt build** and **npm start** to build or build and run the application against the services in the **test** environment.

Additional environments supported by the script are:
    - prod
    - stage

To build against an environment other than **test**, append **:[env]** to the grunt task you're calling. 
For instance, to invoke the build for **prod**, you issue the command **grunt build:prod**.  To build and run the app via NPM against **stage**, you'll call **npm stage**.

## Testing

Tests are grouped by unit tests, end-to-end tests and styling tests under the "test" folder.  Unit tests can be run via
the scripts/test.sh; end-to-end tests can be run via scripts/e2e-test.sh.  Unit test code coverage is published to folder "coverage"
after running the unit test suite.

## Multi-Tenant Mode
 
This project also contains the basic wiring to run the same code instance against multiple configured storefronts. In order
to do so, start the server by calling  "npm run-script multiTenant".  This will start up the Express.JS server configured in file
multi-tenant/multi-tenant-service.js.  When running in multi-tenant mode, any new JS files introduced need to be added to multi-tenant/views/index.jade
The multi-tenant mode is provided for development and test purposes only.
 

# Resources

For in-depth API documentation, please visit https://devportal.yaas.io/

## About this Project

### Why AngularJS?

With the rapid growth in JS frameworks, it is not feasible to evaluate all options, and it is still difficult to make a choice
among a small subset of options.
We were looking for a single-page framework with industry and community traction, support for unit testing,
decoupling of DOM manipulation and application logic, and terseness.  AngularJS fit these requirements very nicely.
Ultimately, the hybris commerce services support all needed business logic, and new client applications can be created with ease as needed.

### Why Node?

We wanted to take advantage of the Node package manger, NPM, for resolving our infrastructure dependencies.  In addition,
the Node based HTTP server turned out to be very quick to start up and thus ideal for development.  The single-tenant distribution 
generated by this project, however, can be deployed on any HTTP server, without NodeJS.

For multi-tenant mode, there is some minimal bootstrapping in place that determines the tenant id that's associated with the
request for an inbound URL. 

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












