# hybris Store Template for the Cloud-based Commerce Services

This is a partner beta release that's meant to showcase the available commerce services and serve as starting point for customizing a store front.


## Limitations in the current service layer
- Checkout not done over SSL
- No tax support


## Install

###  1. System requirements

Install node and npm:

	$ brew install node	# on MacOS

Install grunt:

	$ npm install -g grunt-cli

Install bower:

	$ npm install -g bower



### 2. Project requirements

To locally install the project execute:

	$ npm install
	$ npm update 



### 3. Project startup

Start the project by executing:

	$ npm start



### 4. Endpoint and Project Configuration



### 5. Project deployment

Preparing project for deployment (concatenation/minfication/revisioning):

	$ grunt build

Then on index.html page only add a references to 2 generated static files from **dist** directory (dist/js/*.js, dist/css/*.css).



## Build

- [Bower](http://bower.io/) - package manager for all dependent libraries
- [Grunt](http://gruntjs.com/) - javascript task runner



## Technologies

- [Angular.js](http://angularjs.org/)
- [Angular UI router](https://github.com/angular-ui/ui-router)
- [BootstrapJS]


## Project Organization

The project has been structured into domain modules under public/js/app.  Within each module, files are organized into
 controllers, directives, services, and templates.  API REST calls are made from the domain services.

Third party dependencies are copied to public/js/vendor via the bower-installer command as part of the npm postinstall target
(see package.json file).

## Application Events

'cart:updated' - fired when new cart information has been acquired from the service

## Testing

Tests are grouped by unit tests, end-to-end tests and styling tests under the "test" folder.  Unit tests can be run via
the scripts/test.sh; end-to-end tests can be run via scripts/e2e-test.sh.









