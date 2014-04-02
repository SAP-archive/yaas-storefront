# About

You can find all relevant information about the project within this document.

*Please try keeping this document up to date as much as possible.*


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



### 3. Project startup

Start the project by executing:

	$ npm start



### 4. Project deployment

Preparing project for deployment (concatenation/minfication/revisioning):

	$ grunt build

Then on index.html page only add a references to 2 generated static files from **dist** directory (dist/js/*.js, dist/css/*.css).



## Build

- [Bower](http://bower.io/) - package manager for all dependent libraries
- [Grunt](http://gruntjs.com/) - javascript task runner



## Technologies

- [Angular.js](http://angularjs.org/)
- [Angular UI router](https://github.com/angular-ui/ui-router)



